import { CallstackHelper } from "#/store/reducers/callstackReducer";
import type { ArrayDataState } from "#/store/reducers/structures/arrayReducer";
import type { TreeDataState } from "#/store/reducers/structures/treeNodeReducer";
import {
  createCaseRuntimeArgs,
  setGlobalRuntimeContext,
  stringifySolutionResult,
} from "#/utils";
import type { ArgumentObject } from "#/utils/argumentObject";
import { globalDefinitionsPrefix } from "#/utils/setGlobalRuntimeContext";

const dummy = () => {};
[Array, String, Map, Set, WeakMap, WeakSet].forEach((proto) => {
  // @ts-expect-error These custom methods are not needed for benchmarks
  // prettier-ignore
  proto.prototype.setColor = proto.prototype.blink = proto.prototype.setInfo = dummy;
});

export interface ExecWorkerInterface {
  benchmark: {
    request: {
      type: "benchmark";
      code: string;
      input: unknown[];
      count: number;
    };
    error?: string;
    response: {
      type: "benchmark";
      workStartTime: number;
      results?: number[];
      error?: string;
      averageTime: number;
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
      error?: string;
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
  console.log("Worker received:", event.data);

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
      const getInputFunction = new Function(prefixedCode);
      const runFunction = getInputFunction();
      callstack.clear();
      const startTimestamp = performance.now();
      try {
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
        const response: WorkerResponse = {
          type: "run",
          workStartTime: startTimestamp,
          runtime: performance.now() - startTimestamp,
          error: error.message,
        };
        self.postMessage(response);
      }
      break;
    }

    case "benchmark": {
      const { code, input, count } = data;
      const getInputFunction = new Function(code);
      const runFunction = getInputFunction();
      const timeData: number[] = [];
      const startTimestamp = performance.now();

      for (let i = 0; i < count; i++) {
        const start = performance.now();
        runFunction(...input);
        timeData.push(performance.now() - start);
      }

      const totalTime = performance.now() - startTimestamp;
      const averageTime = totalTime / count;
      timeData.sort((a, b) => a - b);
      const medianTime = timeData[Math.floor(count / 2)];
      const p75Time = timeData[Math.floor(count * 0.75)];
      const p90Time = timeData[Math.floor(count * 0.9)];
      const p99Time = timeData[Math.floor(count * 0.99)];

      const response: CodeBenchmarkResponse = {
        type: "benchmark",
        workStartTime: startTimestamp,
        averageTime,
        medianTime,
        p75Time,
        p90Time,
        p99Time,
      };
      self.postMessage(response);
      break;
    }

    default:
      throw new Error("Invalid worker message type");
  }
});
