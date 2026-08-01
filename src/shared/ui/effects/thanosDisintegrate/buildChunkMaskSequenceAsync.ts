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

const createRevocableSequence = (
  sequence: Omit<ChunkMaskSequence, "revoke">,
): ChunkMaskSequence => {
  const modalMaskUrls = [...sequence.modalMaskUrls];
  const particleMaskUrls = [...sequence.particleMaskUrls];

  return {
    ...sequence,
    modalMaskUrls,
    particleMaskUrls,
    revoke: () => {
      modalMaskUrls.length = 0;
      particleMaskUrls.length = 0;
    },
  };
};

const buildChunkMaskSequenceOnMainThread = (
  input: ChunkMaskSequenceInput,
): ChunkMaskSequence => createRevocableSequence(createChunkMaskSequence(input));

/** Builds chunk masks off-thread when workers are available. */
export const buildChunkMaskSequenceAsync = (
  input: ChunkMaskSequenceInput,
  useWorker = true,
): Promise<ChunkMaskSequence> => {
  if (!useWorker) {
    return Promise.resolve(buildChunkMaskSequenceOnMainThread(input));
  }

  const worker = getChunkMaskWorker();
  if (!worker) {
    return Promise.resolve(buildChunkMaskSequenceOnMainThread(input));
  }

  const requestId = requestCounter + 1;
  requestCounter = requestId;

  return new Promise((resolve) => {
    const cleanup = () => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
    };

    const fallbackToMainThread = () => {
      cleanup();
      resolve(buildChunkMaskSequenceOnMainThread(input));
    };

    const handleMessage = (event: MessageEvent<ChunkMaskWorkerResponse>) => {
      if (event.data.requestId !== requestId) {
        return;
      }

      if (event.data.type === "SUCCESS") {
        cleanup();
        resolve(createRevocableSequence(event.data.sequence));
        return;
      }

      fallbackToMainThread();
    };

    const handleError = () => {
      fallbackToMainThread();
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
