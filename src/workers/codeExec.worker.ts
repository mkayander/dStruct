const dummy = () => {};
// @ts-expect-error This method is not needed for benchmarks
Array.prototype.setColor = String.prototype.setColor = dummy;

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
      results?: number[];
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
      input: string;
    };
    response: {
      type: "run";
      output?: string;
      error?: string;
    };
  };
}

export type WorkerRequestType = keyof ExecWorkerInterface;
export type WorkerRequest = ExecWorkerInterface[WorkerRequestType]["request"];
export type WorkerResponse = ExecWorkerInterface[WorkerRequestType]["response"];

export type CodeBenchmarkRequest = ExecWorkerInterface["benchmark"]["request"];
export type CodeBenchmarkResponse =
  ExecWorkerInterface["benchmark"]["response"];

self.addEventListener("message", (event: MessageEvent<WorkerRequest>) => {
  const { data } = event;
  if (!data.type) throw new Error("No worker message type provided");
  console.log("Worker received:", event.data);

  if (data.type === "benchmark") {
    const { code, input, count } = data;
    const getInputFunction = new Function(code);
    const runFunction = getInputFunction();
    const timeData: number[] = [];
    const totalStart = performance.now();

    for (let i = 0; i < count; i++) {
      const start = performance.now();
      const result = runFunction(...input);
      console.log("Worker: result: ", result);
      timeData.push(performance.now() - start);
    }

    const totalTime = performance.now() - totalStart;
    const averageTime = totalTime / count;
    timeData.sort((a, b) => a - b);
    const medianTime = timeData[Math.floor(count / 2)];
    const p75Time = timeData[Math.floor(count * 0.75)];
    const p90Time = timeData[Math.floor(count * 0.9)];
    const p99Time = timeData[Math.floor(count * 0.99)];

    console.log("Worker results arr: ", timeData);
    const response: CodeBenchmarkResponse = {
      type: "benchmark",
      averageTime,
      medianTime,
      p75Time,
      p90Time,
      p99Time,
    };
    self.postMessage(response);
  }
});
