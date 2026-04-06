"use client";

import { useSnackbar } from "notistack";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { generate } from "short-uuid";

import { selectCaseArguments } from "#/entities/argument/model/caseSlice";
import { callstackSlice } from "#/features/callstack/model/callstackSlice";
import {
  createPythonRuntimeArgs,
  createRawRuntimeArgs,
} from "#/features/codeRunner/lib";
import type { CodeBenchmarkResponse } from "#/features/codeRunner/lib/workers/codeExec.worker";
import { benchmarkSlice } from "#/features/codeRunner/model/benchmarkSlice";
import { resetStructuresState } from "#/features/treeViewer/lib";
import { throttleWithRAF } from "#/shared/lib";
import { useAppStore } from "#/store/hooks";

import { useBenchmarkProgressSnackbar } from "./useBenchmarkProgressSnackbar";
import { useJSCodeRunner } from "./useJSCodeRunner";
import { usePythonCodeRunner } from "./usePythonCodeRunner";

/** Delay after 100% so the progress bar animation completes before snackbar closes. */
const BENCHMARK_PROGRESS_COMPLETE_DELAY_MS = 400;

class ExecutionError extends Error {
  constructor(errorData: ExecutionResult["error"]) {
    if (!errorData) throw new Error("No error data provided");

    super(errorData.message);
    this.name = errorData.name;
    this.stack = errorData.stack;
  }
}

export type ProgrammingLanguage = "javascript" | "python";

// Common interface for execution results across all languages
export interface ExecutionResult {
  output: string;
  callstack: any[];
  runtime: number;
  startTimestamp: number;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  /** Benchmark-specific data (only present when running benchmark) */
  benchmarkResults?: CodeBenchmarkResponse;
}

export const isLanguageValid = (value: unknown): value is ProgrammingLanguage =>
  ["javascript", "python"].includes(String(value));

// Maps language to the corresponding code field in the store
export const getCodeKey = (language: ProgrammingLanguage | "") => {
  switch (language) {
    default:
    case "javascript":
      return "code";
    case "python":
      return "pythonCode";
  }
};

export const toErrorInfo = (
  errorValue: unknown,
): { name: string; message: string; stack?: string } => {
  if (errorValue instanceof Error) {
    return {
      name: errorValue.name,
      message: errorValue.message,
      stack: errorValue.stack,
    };
  }
  return {
    name: "Error",
    message:
      typeof errorValue === "string"
        ? errorValue
        : "An unexpected error occurred",
  };
};

export const useCodeExecution = (
  codeInput: string,
  language: ProgrammingLanguage,
) => {
  const dispatch = useDispatch();
  const store = useAppStore();
  const { enqueueSnackbar } = useSnackbar();
  const [isProcessing, setIsProcessing] = useState(false);

  const { runJSCode, runJSBenchmark } = useJSCodeRunner();
  const { runPythonCode } = usePythonCodeRunner();

  useBenchmarkProgressSnackbar();

  const throttledBenchmarkProgress = useMemo(
    () =>
      throttleWithRAF((current: number, total: number) => {
        dispatch(benchmarkSlice.actions.setProgress({ current, total }));
      }),
    [dispatch],
  );

  // Handles execution errors and updates Redux store accordingly
  const handleExecutionError = useCallback(
    (errorValue: unknown, startTimestamp: number) => {
      const runtime = performance.now() - startTimestamp;
      const errorInfo = toErrorInfo(errorValue);

      dispatch(
        callstackSlice.actions.addOne({
          id: generate(),
          timestamp: performance.now(),
          name: "error",
        }),
      );
      dispatch(
        callstackSlice.actions.setStatus({
          isReady: true,
          error: errorInfo,
          result: null,
          runtime,
          startTimestamp,
        }),
      );

      if (!(errorValue instanceof ExecutionError)) {
        enqueueSnackbar(errorInfo.message, { variant: "error" });
        console.error("Execution error:", errorValue);
      } else {
        console.warn(errorValue);
      }
    },
    [dispatch, enqueueSnackbar],
  );

  // Updates Redux store with successful execution results
  const handleExecutionResult = useCallback(
    (result: ExecutionResult, startTimestamp: number) => {
      if (result.error) {
        handleExecutionError(new ExecutionError(result.error), startTimestamp);
        return;
      }

      dispatch(
        callstackSlice.actions.setStatus({
          isReady: true,
          error: null,
          result: String(result.output),
          frames: result.callstack,
          runtime: result.runtime,
          startTimestamp,
          benchmarkResults: result.benchmarkResults,
        }),
      );
      dispatch(callstackSlice.actions.setIsPlaying(true));
    },
    [dispatch, handleExecutionError],
  );

  // Core execution wrapper that handles state cleanup, timing, and error handling
  const processTask = useCallback(
    async (task: () => Promise<ExecutionResult>) => {
      setIsProcessing(true);
      try {
        // Clear the callstack before running
        dispatch(callstackSlice.actions.removeAll());
        resetStructuresState(dispatch);

        const startTimestamp = performance.now();
        const result = await task();
        handleExecutionResult(result, startTimestamp);
        return result;
      } catch (error) {
        handleExecutionError(error, performance.now());
      } finally {
        setIsProcessing(false);
      }
    },
    [dispatch, handleExecutionResult, handleExecutionError],
  );

  // Executes code based on selected language
  const runCode = useCallback(
    () =>
      processTask(async () => {
        if (language === "javascript") {
          const state = store.getState();
          const caseArgs = selectCaseArguments(state);
          const arrayStore = state.arrayStructure;
          const treeStore = state.treeNode;
          return await runJSCode(codeInput, {
            type: "run",
            code: codeInput,
            caseArgs,
            arrayStore,
            treeStore,
          });
        } else {
          const caseArgs = selectCaseArguments(store.getState());
          const args = createPythonRuntimeArgs(caseArgs);
          return await runPythonCode(codeInput, args);
        }
      }),
    [codeInput, language, processTask, runJSCode, runPythonCode, store],
  );

  // Runs performance benchmark (JavaScript only)
  const runBenchmark = useCallback(
    () =>
      processTask(async () => {
        if (language === "javascript") {
          const state = store.getState();
          const args = createRawRuntimeArgs(selectCaseArguments(state));
          const count = 128;
          const params = {
            type: "benchmark" as const,
            code: codeInput,
            input: args,
            count,
          };
          dispatch(
            benchmarkSlice.actions.setProgress({ current: 0, total: count }),
          );
          try {
            const result = await runJSBenchmark(
              codeInput,
              params,
              throttledBenchmarkProgress,
            );
            dispatch(
              benchmarkSlice.actions.setProgress({
                current: count,
                total: count,
              }),
            );
            setTimeout(() => {
              dispatch(benchmarkSlice.actions.clearProgress());
            }, BENCHMARK_PROGRESS_COMPLETE_DELAY_MS);
            return result;
          } catch (error) {
            setTimeout(() => {
              dispatch(benchmarkSlice.actions.clearProgress());
            }, BENCHMARK_PROGRESS_COMPLETE_DELAY_MS);
            throw error;
          }
        }
        throw new Error("Benchmark not supported for Python");
      }),
    [
      codeInput,
      dispatch,
      language,
      processTask,
      runJSBenchmark,
      store,
      throttledBenchmarkProgress,
    ],
  );

  return { isProcessing, runCode, runBenchmark };
};
