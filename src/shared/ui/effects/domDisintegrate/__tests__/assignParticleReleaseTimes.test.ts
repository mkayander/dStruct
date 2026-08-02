import { describe, expect, it } from "vitest";

import { createTestDisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/__tests__/createTestDisintegrateParticle";
import {
  assignParticleReleaseTimes,
  resolveEffectiveMaskStrategy,
} from "#/shared/ui/effects/domDisintegrate/assignParticleReleaseTimes";

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
      createTestDisintegrateParticle({ x: 0, y: 0 }),
      createTestDisintegrateParticle({ x: 100, y: 0 }),
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
      createTestDisintegrateParticle({ x: 0, y: 0 }),
      createTestDisintegrateParticle({ x: 90, y: 30 }),
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
