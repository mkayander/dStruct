import type {
  ChunkMaskWorkerRequest,
  ChunkMaskWorkerResponse,
} from "#/shared/ui/effects/thanosDisintegrate/chunkMaskWorker.types";
import { createChunkMaskSequenceAsync } from "#/shared/ui/effects/thanosDisintegrate/createChunkMaskSequence";

self.addEventListener(
  "message",
  (event: MessageEvent<ChunkMaskWorkerRequest>) => {
    const { requestId, ...input } = event.data;

    void (async () => {
      try {
        const sequence = await createChunkMaskSequenceAsync(input);
        const response: ChunkMaskWorkerResponse = {
          type: "SUCCESS",
          requestId,
          sequence: {
            timeThresholds: sequence.timeThresholds,
            modalMaskUrls: sequence.modalMaskUrls,
            particleMaskUrls: sequence.particleMaskUrls,
            modalMaskSize: sequence.modalMaskSize,
            particleMaskSize: sequence.particleMaskSize,
          },
        };
        self.postMessage(response);
      } catch (error) {
        const response: ChunkMaskWorkerResponse = {
          type: "ERROR",
          requestId,
          message: error instanceof Error ? error.message : String(error),
        };
        self.postMessage(response);
      }
    })();
  },
);
