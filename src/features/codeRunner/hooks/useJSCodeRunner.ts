import { useCallback } from "react";

import type { ExecWorkerInterface } from "#/features/codeRunner/lib/workers/codeExec.worker";
import {
  requestBenchmarkWithProgress,
  requestWorkerAction,
} from "#/features/codeRunner/lib/workers/codeExecWorkerInterface";

import type { ExecutionResult } from "./useCodeExecution";
import { useJSWorker } from "./useJSWorker";

type RunParams = ExecWorkerInterface["run"]["request"];
type BenchmarkParams = ExecWorkerInterface["benchmark"]["request"];

export const useJSCodeRunner = () => {
  const { worker } = useJSWorker();

  const runJSBenchmark = useCallback(
    async (
      codeInput: string,
      params: BenchmarkParams,
      onProgress?: (current: number, total: number) => void,
    ): Promise<ExecutionResult> => {
      if (!worker) throw new Error("Worker not initialized");

      const request = {
        type: "benchmark" as const,
        code: codeInput,
        input: params.input,
        count: params.count,
      };

      const result = onProgress
        ? await requestBenchmarkWithProgress(worker, request, onProgress)
        : await requestWorkerAction(worker, "benchmark", request);

      return {
        output: result.output || "",
        callstack: [],
        runtime: result.runtime,
        startTimestamp: result.workStartTime,
        error: result.error
          ? {
              name: result.error.name,
              message: result.error.message,
              stack: result.error.stack,
            }
          : undefined,
        benchmarkResults: result,
      };
    },
    [worker],
  );

  const runJSCode = useCallback(
    async (codeInput: string, params: RunParams): Promise<ExecutionResult> => {
      if (!worker) throw new Error("Worker not initialized");

      const result = await requestWorkerAction(worker, "run", {
        type: "run",
        code: codeInput,
        caseArgs: params.caseArgs,
        arrayStore: params.arrayStore,
        treeStore: params.treeStore,
      });

      return {
        output: result.output || "",
        callstack: result.callstack || [],
        runtime: result.runtime,
        startTimestamp: result.workStartTime,
        error: result.error
          ? {
              name: result.error.name,
              message: result.error.message,
              stack: result.error.stack,
            }
          : undefined,
      };
    },
    [worker],
  );

  return { worker, runJSBenchmark, runJSCode };
};
