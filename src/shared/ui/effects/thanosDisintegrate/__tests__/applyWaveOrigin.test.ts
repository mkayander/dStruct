import { describe, expect, it } from "vitest";

import { applyWaveOrigin } from "#/shared/ui/effects/thanosDisintegrate/applyWaveOrigin";
import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

const createParticle = (x: number, y: number): ThanosParticle => ({
  x,
  y,
  vx: 0,
  vy: 0,
  color: "rgb(0, 0, 0)",
  alpha: 1,
  baseAlpha: 1,
  size: 2,
  decay: 0.02,
  releaseFrame: 0,
});

describe("applyWaveOrigin", () => {
  it("delays particles farther from the origin", () => {
    const particles = [createParticle(0, 0), createParticle(30, 0)];

    const maxReleaseFrame = applyWaveOrigin(particles, { x: 0, y: 0 }, 10);

    expect(particles[0]?.releaseFrame).toBe(0);
    expect(particles[1]?.releaseFrame).toBe(3);
    expect(maxReleaseFrame).toBe(3);
  });
});
