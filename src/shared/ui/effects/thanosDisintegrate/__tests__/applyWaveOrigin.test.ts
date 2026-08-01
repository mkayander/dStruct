import { describe, expect, it } from "vitest";

import { applyWaveOrigin } from "#/shared/ui/effects/thanosDisintegrate/applyWaveOrigin";
import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

const createParticle = (x: number, y: number): ThanosParticle => ({
  x,
  y,
  originX: x,
  originY: y,
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
  releaseTime: 0,
  turbulenceSeed: 0,
});

describe("applyWaveOrigin", () => {
  it("delays particles farther from the origin", () => {
    const particles = [createParticle(0, 0), createParticle(30, 0)];

    const maxReleaseTime = applyWaveOrigin(particles, { x: 0, y: 0 }, 10);

    expect(particles[0]?.releaseTime).toBeGreaterThanOrEqual(0);
    expect(particles[0]?.releaseTime).toBeLessThan(0.05);
    expect(particles[1]?.releaseTime).toBeGreaterThan(2.5);
    expect(maxReleaseTime).toBe(particles[1]?.releaseTime);
  });
});
