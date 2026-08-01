import { describe, expect, it } from "vitest";

import {
  assignParticleReleaseTimes,
  resolveEffectiveMaskStrategy,
} from "#/shared/ui/effects/thanosDisintegrate/assignParticleReleaseTimes";
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

describe("resolveEffectiveMaskStrategy", () => {
  it("defaults to wave when a click origin is present", () => {
    expect(resolveEffectiveMaskStrategy(undefined, true)).toBe("wave");
  });

  it("defaults to centerOut without a click origin", () => {
    expect(resolveEffectiveMaskStrategy(undefined, false)).toBe("centerOut");
  });

  it("respects an explicit strategy override", () => {
    expect(resolveEffectiveMaskStrategy("sand", true)).toBe("sand");
  });
});

describe("assignParticleReleaseTimes", () => {
  it("staggers release times from a click-origin wave", () => {
    const particles = [
      createParticle({ x: 0, y: 0 }),
      createParticle({ x: 100, y: 0 }),
    ];

    const maxReleaseTime = assignParticleReleaseTimes(particles, {
      strategy: "wave",
      displayWidth: 120,
      displayHeight: 48,
      particleStep: 3,
      maskSpreadDuration: 0.6,
      waveOrigin: { x: 0, y: 0 },
      waveSpeed: 100,
    });

    expect(particles[0]!.releaseTime).toBeLessThan(particles[1]!.releaseTime);
    expect(maxReleaseTime).toBeGreaterThan(0);
  });

  it("spreads release times across a grid strategy", () => {
    const particles = [
      createParticle({ x: 0, y: 0 }),
      createParticle({ x: 90, y: 30 }),
    ];

    assignParticleReleaseTimes(particles, {
      strategy: "leftToRight",
      displayWidth: 120,
      displayHeight: 48,
      particleStep: 3,
      maskSpreadDuration: 0.6,
      waveOrigin: null,
      waveSpeed: 700,
    });

    expect(particles[0]!.releaseTime).toBeLessThan(particles[1]!.releaseTime);
  });
});
