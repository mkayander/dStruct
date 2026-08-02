import { describe, expect, it } from "vitest";

import { createTestDisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/__tests__/createTestDisintegrateParticle";
import { canReuseWarmChunkMasks } from "#/shared/ui/effects/domDisintegrate/prebuildWarmChunkMasks";

describe("canReuseWarmChunkMasks", () => {
  it("returns true when warm chunk masks match dismiss options", () => {
    expect(
      canReuseWarmChunkMasks(
        {
          sourceCanvas: null,
          particles: [createTestDisintegrateParticle()],
          displayWidth: 120,
          displayHeight: 40,
          chunkMaskSequence: {
            modalMaskUrls: ["a"],
            particleMaskUrls: ["b"],
            modalMaskSize: "1px 1px",
            particleMaskSize: "1px 1px",
            timeThresholds: [0],
            revoke: () => undefined,
          },
          warmMaskStrategy: "centerOut",
        },
        "chunks",
        "centerOut",
      ),
    ).toBe(true);
  });

  it("returns false for radial dismiss or wave strategy", () => {
    const snapshot = {
      sourceCanvas: null,
      particles: [createTestDisintegrateParticle()],
      displayWidth: 120,
      displayHeight: 40,
      chunkMaskSequence: {
        modalMaskUrls: ["a"],
        particleMaskUrls: ["b"],
        modalMaskSize: "1px 1px",
        particleMaskSize: "1px 1px",
        timeThresholds: [0],
        revoke: () => undefined,
      },
      warmMaskStrategy: "centerOut" as const,
    };

    expect(canReuseWarmChunkMasks(snapshot, "radial", "centerOut")).toBe(false);
    expect(canReuseWarmChunkMasks(snapshot, "chunks", "wave")).toBe(false);
  });
});
