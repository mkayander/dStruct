import type { ChunkMaskSequenceInput } from "#/shared/ui/effects/thanosDisintegrate/createChunkMaskSequence";

export type ChunkMaskSequencePayload = {
  timeThresholds: number[];
  modalMaskUrls: string[];
  particleMaskUrls: string[];
  modalMaskSize: string;
  particleMaskSize: string;
};

export type ChunkMaskWorkerRequest = ChunkMaskSequenceInput & {
  requestId: number;
};

export type ChunkMaskWorkerResponse =
  | {
      type: "SUCCESS";
      requestId: number;
      sequence: ChunkMaskSequencePayload;
    }
  | {
      type: "ERROR";
      requestId: number;
      message: string;
    };
