import type {
  ExecWorkerInterface,
  WorkerRequestType,
  WorkerResponse,
} from "#/workers/codeExec.worker";

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
