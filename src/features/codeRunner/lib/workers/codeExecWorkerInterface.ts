import type {
  CodeBenchmarkRequest,
  CodeBenchmarkResponse,
  ExecWorkerInterface,
  WorkerRequestType,
  WorkerResponse,
} from "#/features/codeRunner/lib/workers/codeExec.worker";

export type BenchmarkProgressMessage = {
  type: "benchmark-progress";
  current: number;
  total: number;
};

export const awaitWorkerResponse = <T extends WorkerRequestType>(
  worker: Worker,
  type: T,
  timeLimit = 60000,
): Promise<ExecWorkerInterface[T]["response"]> =>
  new Promise((resolve, reject) => {
    const listener = (event: MessageEvent<WorkerResponse>) => {
      if (event.data?.type !== type) return;

      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
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

export const requestWorkerAction = async <T extends WorkerRequestType>(
  worker: Worker,
  type: T,
  request: ExecWorkerInterface[T]["request"],
): Promise<ExecWorkerInterface[T]["response"]> => {
  const promise = awaitWorkerResponse(worker, type);
  worker.postMessage(request);
  return promise;
};

export const requestBenchmarkWithProgress = async (
  worker: Worker,
  request: CodeBenchmarkRequest,
  onProgress: (current: number, total: number) => void,
  timeLimit = 60000,
): Promise<CodeBenchmarkResponse> =>
  new Promise((resolve, reject) => {
    const messageListener = (
      event: MessageEvent<WorkerResponse | BenchmarkProgressMessage>,
    ) => {
      const data = event.data;
      if (data?.type === "benchmark-progress") {
        onProgress(data.current, data.total);
        return;
      }
      if (data?.type === "benchmark") {
        worker.removeEventListener("message", messageListener);
        clearTimeout(timeoutId);
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data);
        }
      }
    };

    worker.addEventListener("message", messageListener);
    worker.postMessage(request);

    const timeoutId = setTimeout(() => {
      worker.removeEventListener("message", messageListener);
      reject(
        new Error(
          `Worker request time limit expired! No response in ${timeLimit}ms`,
        ),
      );
    }, timeLimit);
  });
