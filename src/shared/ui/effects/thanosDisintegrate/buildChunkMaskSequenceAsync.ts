import type {
  ChunkMaskWorkerRequest,
  ChunkMaskWorkerResponse,
} from "#/shared/ui/effects/thanosDisintegrate/chunkMaskWorker.types";
import {
  type ChunkMaskSequence,
  type ChunkMaskSequenceInput,
  createChunkMaskSequence,
} from "#/shared/ui/effects/thanosDisintegrate/createChunkMaskSequence";

let requestCounter = 0;
let workerInstance: Worker | null = null;

const getChunkMaskWorker = (): Worker | null => {
  if (typeof Worker === "undefined") {
    return null;
  }

  if (!workerInstance) {
    workerInstance = new Worker(
      new URL("./chunkMaskWorker.ts", import.meta.url),
      { type: "module" },
    );
  }

  return workerInstance;
};

export const terminateChunkMaskWorker = (): void => {
  workerInstance?.terminate();
  workerInstance = null;
};

/** Builds chunk masks off-thread when workers are available. */
export const buildChunkMaskSequenceAsync = (
  input: ChunkMaskSequenceInput,
  useWorker = true,
): Promise<ChunkMaskSequence> => {
  if (!useWorker) {
    return Promise.resolve(createChunkMaskSequence(input));
  }

  const worker = getChunkMaskWorker();
  if (!worker) {
    return Promise.resolve(createChunkMaskSequence(input));
  }

  const requestId = requestCounter + 1;
  requestCounter = requestId;

  return new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent<ChunkMaskWorkerResponse>) => {
      if (event.data.requestId !== requestId) {
        return;
      }

      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);

      if (event.data.type === "SUCCESS") {
        resolve({
          ...event.data.sequence,
          revoke: () => {},
        });
        return;
      }

      reject(new Error(event.data.message));
    };

    const handleError = () => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      reject(new Error("Chunk mask worker failed"));
    };

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleError);

    const request: ChunkMaskWorkerRequest = {
      ...input,
      requestId,
    };
    worker.postMessage(request);
  });
};
