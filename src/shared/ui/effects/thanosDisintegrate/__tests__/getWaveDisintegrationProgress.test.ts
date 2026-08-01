import { describe, expect, it } from "vitest";

import { getWaveDisintegrationProgress } from "#/shared/ui/effects/thanosDisintegrate/getWaveDisintegrationProgress";
import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

const createParticle = (releaseTime: number): ThanosParticle => ({
  x: 0,
  y: 0,
  originX: 0,
  originY: 0,
  vx: 0,
  vy: 0,
  color: "rgb(0, 0, 0)",
  alpha: 1,
  baseAlpha: 1,
  size: 2,
  rotation: 0,
  rotationSpeed: 0,
  drag: 0.96,
  fadeStart: 0.5,
  fadeDuration: 0.4,
  releaseTime,
  turbulenceSeed: 0,
});

describe("getWaveDisintegrationProgress", () => {
  it("ramps from 0 before the wave to 1 after all particles release", () => {
    const particles = [createParticle(0), createParticle(0.5)];

    expect(getWaveDisintegrationProgress(particles, 0)).toBe(0);
    expect(getWaveDisintegrationProgress(particles, 1)).toBe(1);
  });
});
