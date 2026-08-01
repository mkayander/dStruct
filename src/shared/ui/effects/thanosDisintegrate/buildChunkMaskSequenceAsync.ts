import type {
  ChunkMaskWorkerRequest,
  ChunkMaskWorkerResponse,
} from "#/shared/ui/effects/thanosDisintegrate/chunkMaskWorker.types";
import {
  type ChunkMaskSequence,
  type ChunkMaskSequenceInput,
  createChunkMaskSequenceAsync,
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

export const prewarmChunkMaskWorker = (): void => {
  getChunkMaskWorker();
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

const buildChunkMaskSequenceYieldingOnMainThread = async (
  input: ChunkMaskSequenceInput,
): Promise<ChunkMaskSequence> =>
  createRevocableSequence(
    await createChunkMaskSequenceAsync(input, {
      preferOffscreen: true,
      yieldBetweenSteps: true,
    }),
  );

/**
 * Builds chunk masks off-thread when workers are available.
 * Returns null when the worker is unavailable or fails so callers can fall back
 * to radial masks without blocking the main thread on sync PNG encoding.
 */
export const buildChunkMaskSequenceAsync = (
  input: ChunkMaskSequenceInput,
  useWorker = true,
): Promise<ChunkMaskSequence | null> => {
  if (!useWorker) {
    return buildChunkMaskSequenceYieldingOnMainThread(input);
  }

  const worker = getChunkMaskWorker();
  if (!worker) {
    return Promise.resolve(null);
  }

  const requestId = requestCounter + 1;
  requestCounter = requestId;

  return new Promise((resolve) => {
    const cleanup = () => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
    };

    const handleMessage = (event: MessageEvent<ChunkMaskWorkerResponse>) => {
      if (event.data.requestId !== requestId) {
        return;
      }

      cleanup();

      if (event.data.type === "SUCCESS") {
        resolve(createRevocableSequence(event.data.sequence));
        return;
      }

      resolve(null);
    };

    const handleError = () => {
      cleanup();
      resolve(null);
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
