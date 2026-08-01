import { describe, expect, it } from "vitest";

import { buildChunkMaskSequenceAsync } from "#/shared/ui/effects/thanosDisintegrate/buildChunkMaskSequenceAsync";
import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

const createParticle = (
  overrides: Partial<ThanosParticle> = {},
): ThanosParticle => ({
  x: 0,
  y: 0,
  originX: 0,
  originY: 0,
  vx: 0,
  vy: 0,
  color: "rgb(255, 0, 0)",
  alpha: 1,
  baseAlpha: 1,
  size: 2,
  rotation: 0,
  rotationSpeed: 0,
  drag: 0.96,
  fadeStart: 0.5,
  fadeDuration: 0.4,
  releaseTime: 0,
  ...overrides,
});

describe("buildChunkMaskSequenceAsync", () => {
  it("builds masks on the main thread when workers are disabled", async () => {
    const sequence = await buildChunkMaskSequenceAsync(
      {
        particles: [createParticle({ x: 0, y: 0, releaseTime: 0 })],
        displayWidth: 12,
        displayHeight: 6,
        particlePadding: 4,
        chunkSize: 3,
        maxSteps: 8,
      },
      false,
    );

    expect(sequence.modalMaskUrls.length).toBeGreaterThan(0);
    expect(sequence.particleMaskUrls).toHaveLength(
      sequence.modalMaskUrls.length,
    );
  });
});
