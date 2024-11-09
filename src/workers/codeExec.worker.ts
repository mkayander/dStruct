import type { ArgumentObject } from "#/entities/argument/model/types";
import type { ArrayDataState } from "#/entities/dataStructures/array/model/arraySlice";
import type { TreeDataState } from "#/entities/dataStructures/node/model/nodeSlice";
import { CallstackHelper } from "#/features/callstack/model/callstackSlice";
import { createCaseRuntimeArgs } from "#/features/codeRunner/lib";
import {
  globalDefinitionsPrefix,
  setGlobalRuntimeContext,
} from "#/features/codeRunner/lib/setGlobalRuntimeContext";
import { stringifySolutionResult } from "#/shared/lib";

const dummy = () => {};
[Array, String, Map, Set, WeakMap, WeakSet, Object].forEach((proto) =>
  // prettier-ignore
  ["setColor", "blink", "setInfo", "showIndexes"].forEach((method) => 
    Object.defineProperty(proto.prototype, method, {
      value: dummy,
      writable: false,
      enumerable: false,
      configurable: false,
    })
  ),
);

export interface ExecWorkerInterface {
  benchmark: {
    request: {
      type: "benchmark";
      code: string;
      input: unknown[];
      count: number;
    };
    response: {
      type: "benchmark";
      workStartTime: number;
      runtime: number;
      results?: number[];
      output?: string;
      error?: Error;
      averageTime?: number;
      medianTime?: number;
      p75Time?: number;
      p90Time?: number;
      p99Time?: number;
    };
  };
  run: {
    request: {
      type: "run";
      code: string;
      caseArgs: ArgumentObject[];
      treeStore: TreeDataState;
      arrayStore: ArrayDataState;
    };
    response: {
      type: "run";
      workStartTime: number;
      runtime: number;
      output?: string;
      error?: Error;
      callstack?: CallstackHelper["frames"];
    };
  };
}

export type WorkerRequestType = keyof ExecWorkerInterface;
export type WorkerRequest = ExecWorkerInterface[WorkerRequestType]["request"];
export type WorkerResponse = ExecWorkerInterface[WorkerRequestType]["response"];

export type CodeBenchmarkRequest = ExecWorkerInterface["benchmark"]["request"];
export type CodeBenchmarkResponse =
  ExecWorkerInterface["benchmark"]["response"];

const callstack = new CallstackHelper();
setGlobalRuntimeContext(callstack);

self.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
  const { data } = event;
  if (!data.type) throw new Error("No worker message type provided");

  switch (data.type) {
    case "run": {
      const { code, caseArgs, arrayStore, treeStore } = data;
      const args = createCaseRuntimeArgs(
        callstack,
        treeStore,
        arrayStore,
        caseArgs,
      );
      const prefixedCode = `${globalDefinitionsPrefix}\n${code}`;
      const startTimestamp = performance.now();
      try {
        const getInputFunction = new Function(prefixedCode);
        const runFunction = getInputFunction();
        callstack.clear();
        const result = runFunction(...args);
        const response: WorkerResponse = {
          type: "run",
          workStartTime: startTimestamp,
          runtime: performance.now() - startTimestamp,
          output: stringifySolutionResult(result),
          callstack: callstack.frames,
        };
        self.postMessage(response);
      } catch (error: any) {
        console.log("Worker: error: ", error);
        const errorResponse: WorkerResponse = {
          type: "run",
          workStartTime: startTimestamp,
          runtime: performance.now() - startTimestamp,
          error,
        };
        self.postMessage(errorResponse);
      }
      break;
    }

    case "benchmark": {
      const { code, input, count } = data;
      const startTimestamp = performance.now();
      try {
        const getInputFunction = new Function(code);
        const runFunction = getInputFunction();
        const timeData: number[] = [];
        let output: any;

        for (let i = 0; i < count; i++) {
          const start = performance.now();
          output = runFunction(...input);
          timeData.push(performance.now() - start);
        }

        const totalTime = performance.now() - startTimestamp;
        const averageTime = totalTime / count;
        const sortedTimeData = timeData.toSorted((a, b) => a - b);
        const medianTime = sortedTimeData[Math.floor(count / 2)];
        const p75Time = sortedTimeData[Math.floor(count * 0.75)];
        const p90Time = sortedTimeData[Math.floor(count * 0.9)];
        const p99Time = sortedTimeData[Math.floor(count * 0.99)];

        const response: CodeBenchmarkResponse = {
          type: "benchmark",
          workStartTime: startTimestamp,
          runtime: totalTime,
          results: timeData,
          output: stringifySolutionResult(output),
          averageTime,
          medianTime,
          p75Time,
          p90Time,
          p99Time,
        };
        self.postMessage(response);
      } catch (error: any) {
        console.log("Worker: error: ", error);
        const errorResponse: WorkerResponse = {
          type: "benchmark",
          workStartTime: performance.now(),
          runtime: performance.now() - startTimestamp,
          error,
        };
        self.postMessage(errorResponse);
      }
      break;
    }

    default:
      throw new Error("Invalid worker message type");
  }
});
