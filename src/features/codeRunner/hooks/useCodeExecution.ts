"use client";

import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { generate } from "short-uuid";

import { selectCaseArguments } from "#/entities/argument/model/caseSlice";
import { callstackSlice } from "#/features/callstack/model/callstackSlice";
import { createRawRuntimeArgs } from "#/features/codeRunner/lib";
import { resetStructuresState } from "#/features/treeViewer/lib";
import { useAppStore } from "#/store/hooks";

import { useJSCodeRunner } from "./useJSCodeRunner";
import { usePythonCodeRunner } from "./usePythonCodeRunner";

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

export const useCodeExecution = (
  codeInput: string,
  language: ProgrammingLanguage,
) => {
  const dispatch = useDispatch();
  const store = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const { runJSCode, runJSBenchmark } = useJSCodeRunner();
  const { runPythonCode } = usePythonCodeRunner();

  // Handles execution errors and updates Redux store accordingly
  const handleExecutionError = useCallback(
    (e: unknown, startTimestamp: number) => {
      const runtime = performance.now() - startTimestamp;
      if (e instanceof ExecutionError) {
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
            error: { name: e.name, message: e.message, stack: e.stack },
            result: null,
            runtime,
            startTimestamp,
          }),
        );
        console.warn(e);
      } else {
        console.error("Invalid error type: ", e);
      }
    },
    [dispatch],
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
      } catch (e) {
        handleExecutionError(e, performance.now());
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
          return await runPythonCode(codeInput);
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
          return await runJSBenchmark(codeInput, {
            type: "benchmark",
            code: codeInput,
            input: args,
            count: 128,
          });
        }
        throw new Error("Benchmark not supported for Python");
      }),
    [codeInput, language, processTask, runJSBenchmark, store],
  );

  return { isProcessing, runCode, runBenchmark };
};
