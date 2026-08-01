import { describe, expect, it, vi } from "vitest";

import {
  buildChunkMaskThresholds,
  createChunkMaskSequence,
  getChunkMaskIndex,
  revealParticleChunk,
  revealParticleMaskBleedZone,
} from "#/shared/ui/effects/thanosDisintegrate/createChunkMaskSequence";
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

describe("createChunkMaskSequence", () => {
  it("buckets release times to a bounded number of thresholds", () => {
    const particles = [
      createParticle({ releaseTime: 0 }),
      createParticle({ releaseTime: 0.1 }),
      createParticle({ releaseTime: 0.2 }),
      createParticle({ releaseTime: 0.35 }),
    ];

    const thresholds = buildChunkMaskThresholds(particles, 2);

    expect(thresholds.length).toBeLessThanOrEqual(2);
  });

  it("selects the mask step for the current elapsed time", () => {
    const thresholds = [0, 0.2, 0.5];

    expect(getChunkMaskIndex(thresholds, 0)).toBe(0);
    expect(getChunkMaskIndex(thresholds, 0.25)).toBe(1);
    expect(getChunkMaskIndex(thresholds, 0.6)).toBe(2);
  });

  it("builds paired modal and particle mask data urls", () => {
    const particles = [
      createParticle({ x: 0, y: 0, releaseTime: 0 }),
      createParticle({ x: 3, y: 0, releaseTime: 0.5 }),
    ];

    const sequence = createChunkMaskSequence({
      particles,
      displayWidth: 12,
      displayHeight: 6,
      particlePadding: 4,
      particleRevealMargin: 6,
      chunkSize: 3,
      maxSteps: 8,
    });

    expect(sequence.modalMaskUrls.length).toBeGreaterThan(0);
    expect(sequence.particleMaskUrls).toHaveLength(
      sequence.modalMaskUrls.length,
    );
    expect(sequence.modalMaskUrls[0]).toMatch(/^data:image\/png;base64,/);
    expect(sequence.particleMaskSize).toBe("20px 14px");
  });

  it("pre-reveals the particle canvas bleed zone before any chunks dissolve", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 20;
    canvas.height = 14;
    const context = canvas.getContext("2d");
    expect(context).not.toBeNull();
    if (!context) {
      return;
    }

    const fillRectSpy = vi.spyOn(context, "fillRect");
    revealParticleMaskBleedZone(context, 12, 6, 4);

    expect(fillRectSpy).toHaveBeenCalledTimes(4);
    expect(fillRectSpy).toHaveBeenCalledWith(0, 0, 20, 4);
  });

  it("expands particle chunk reveals beyond the grid cell size", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 20;
    canvas.height = 14;
    const context = canvas.getContext("2d");
    expect(context).not.toBeNull();
    if (!context) {
      return;
    }

    const fillRectSpy = vi.spyOn(context, "fillRect");
    revealParticleChunk(context, { x: 6, y: 3, releaseTime: 0 }, 4, 3, 8);

    expect(fillRectSpy).toHaveBeenCalledWith(2, -1, 19, 19);
  });
});
