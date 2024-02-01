"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import shortUUID from "short-uuid";

import { useAppSelector } from "#/store/hooks";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import { selectCaseArguments } from "#/store/reducers/caseReducer";
import { arrayDataSelector } from "#/store/reducers/structures/arrayReducer";
import { treeDataSelector } from "#/store/reducers/structures/treeNodeReducer";
import { resetStructuresState, stringifySolutionResult } from "#/utils";
import { createRawRuntimeArgs } from "#/utils/createCaseRuntimeArgs";

import type {
  CodeBenchmarkRequest,
  ExecWorkerInterface,
  WorkerRequestType,
  WorkerResponse,
} from "#/workers/codeExec.worker";

const uuid = shortUUID();

const getWorkerResponse = <T extends WorkerRequestType>(
  worker: Worker,
  type: T,
  timeLimit = 60000,
): Promise<ExecWorkerInterface[T]["response"]> =>
  new Promise((resolve, reject) => {
    const listener = (event: MessageEvent<WorkerResponse>) => {
      if (event.data?.type !== type) return;

      console.log("Worker response:", event.data);
      resolve(event.data);
    };
    worker.addEventListener("message", listener, { once: true });

    setTimeout(() => {
      worker.removeEventListener("message", listener);
      reject(
        new Error(
          `Worker request time limit expired! No response in ${timeLimit}ms`,
        ),
      );
    }, timeLimit);
  });

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
    worker.postMessage({
      type: "benchmark",
      code: codeInput,
      input: args,
      count: 128,
    } satisfies CodeBenchmarkRequest);

    try {
      const result = await getWorkerResponse(worker, "benchmark");
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
    worker.postMessage({
      type: "run",
      code: codeInput,
      caseArgs,
      arrayStore,
      treeStore,
    } satisfies ExecWorkerInterface["run"]["request"]);

    const startTimestamp = performance.now();

    try {
      const { runtime, output, error, callstack } = await getWorkerResponse(
        worker,
        "run",
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
