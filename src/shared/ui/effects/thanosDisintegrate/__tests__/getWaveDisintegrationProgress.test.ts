import { describe, expect, it } from "vitest";

import { getWaveDisintegrationProgress } from "#/shared/ui/effects/thanosDisintegrate/getWaveDisintegrationProgress";
import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

const createParticle = (releaseFrame: number): ThanosParticle => ({
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
  decay: 0.02,
  releaseFrame,
});

describe("getWaveDisintegrationProgress", () => {
  it("ramps from 0 before the wave to 1 after all particles release", () => {
    const particles = [createParticle(0), createParticle(10)];

    expect(getWaveDisintegrationProgress(particles, 0)).toBe(0);
    expect(getWaveDisintegrationProgress(particles, 20)).toBe(1);
  });
});
