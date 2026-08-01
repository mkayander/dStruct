import type {
  ChunkMaskWorkerRequest,
  ChunkMaskWorkerResponse,
} from "#/shared/ui/effects/domDisintegrate/chunkMaskWorker.types";
import {
  type ChunkMaskSequence,
  type ChunkMaskSequenceInput,
  createChunkMaskSequenceAsync,
} from "#/shared/ui/effects/domDisintegrate/createChunkMaskSequence";

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

const warnChunkMaskFallback = (reason: string): void => {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.warn(`[domDisintegrate] ${reason}`);
};

const buildChunkMaskSequenceViaWorker = (
  input: ChunkMaskSequenceInput,
): Promise<ChunkMaskSequence | null> => {
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

      warnChunkMaskFallback(
        `Chunk mask worker failed: ${event.data.message}. Falling back to main thread.`,
      );
      resolve(null);
    };

    const handleError = () => {
      cleanup();
      warnChunkMaskFallback(
        "Chunk mask worker crashed. Falling back to main thread.",
      );
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

/**
 * Builds chunk masks off-thread when workers are available, otherwise on the
 * main thread with yields between steps. Worker failures fall back to the
 * yielding main-thread path instead of returning null.
 */
export const buildChunkMaskSequenceAsync = async (
  input: ChunkMaskSequenceInput,
  useWorker = true,
): Promise<ChunkMaskSequence | null> => {
  if (!useWorker) {
    return buildChunkMaskSequenceYieldingOnMainThread(input);
  }

  const workerSequence = await buildChunkMaskSequenceViaWorker(input);
  if (workerSequence) {
    return workerSequence;
  }

  if (!getChunkMaskWorker()) {
    warnChunkMaskFallback(
      "Workers are unavailable. Building chunk masks on the main thread.",
    );
  }

  try {
    return await buildChunkMaskSequenceYieldingOnMainThread(input);
  } catch (error) {
    console.error(
      "[domDisintegrate] Chunk mask build failed on the main thread.",
      error,
    );
    return null;
  }
};
