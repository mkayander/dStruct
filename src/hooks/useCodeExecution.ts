"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import shortUUID from "short-uuid";

import { useAppSelector } from "#/store/hooks";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import { selectCaseArguments } from "#/store/reducers/caseReducer";
import { arrayDataSelector } from "#/store/reducers/structures/arrayReducer";
import { treeDataSelector } from "#/store/reducers/structures/treeNodeReducer";
import { resetStructuresState } from "#/utils";
import { createRawRuntimeArgs } from "#/utils/createCaseRuntimeArgs";

import { requestWorkerAction } from "#/workers/codeExecWorkerInterface";

export type ProgrammingLanguage = "javascript" | "python";

export const isLanguageValid = (value: unknown): value is ProgrammingLanguage =>
  ["javascript", "python"].includes(String(value));

export const getCodeKey = (language: ProgrammingLanguage) => {
  switch (language) {
    case "javascript":
      return "code";
    case "python":
      return "pythonCode";
  }
};

const uuid = shortUUID();

export const useCodeExecution = (codeInput: string) => {
  const dispatch = useDispatch();

  const [worker, setWorker] = useState<Worker | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL("src/workers/codeExec.worker.ts", import.meta.url),
    );
    setWorker(worker);

    return () => {
      worker.terminate();
    };
  }, []);

  const runBenchmark = async () => {
    if (!worker) return;

    setIsProcessing(true);
    const args = createRawRuntimeArgs(caseArgs);

    try {
      const result = await requestWorkerAction(worker, "benchmark", {
        type: "benchmark",
        code: codeInput,
        input: args,
        count: 128,
      });
      setError(null);
      return result;
    } catch (e: any) {
      setError(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const treeStore = useAppSelector(treeDataSelector);
  const arrayStore = useAppSelector(arrayDataSelector);
  const caseArgs = useAppSelector(selectCaseArguments);

  const runCode = async () => {
    if (!worker) return;

    setIsProcessing(true);

    // Before running the code, clear the callstack
    dispatch(callstackSlice.actions.removeAll());
    resetStructuresState(dispatch);

    const startTimestamp = performance.now();

    try {
      const { runtime, output, error, callstack } = await requestWorkerAction(
        worker,
        "run",
        {
          type: "run",
          code: codeInput,
          caseArgs,
          arrayStore,
          treeStore,
        },
      );
      if (error) throw error;
      setError(null);

      // Identify that the callstack is filled and can now be used
      dispatch(
        callstackSlice.actions.setStatus({
          isReady: true,
          error: null,
          result: String(output),
          frames: callstack,
          runtime,
          startTimestamp,
        }),
      );
      // Automatically play the callstack
      dispatch(callstackSlice.actions.setIsPlaying(true));
    } catch (e: unknown) {
      const runtime = performance.now() - startTimestamp;
      if (e instanceof Error) {
        dispatch(
          callstackSlice.actions.addOne({
            id: uuid.generate(),
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
    } finally {
      setIsProcessing(false);
    }
  };

  return { worker, isProcessing, error, runBenchmark, runCode };
};
