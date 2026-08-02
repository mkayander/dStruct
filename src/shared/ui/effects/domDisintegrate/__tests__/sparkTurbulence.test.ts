import { describe, expect, it } from "vitest";

import {
  createSparkTurbulenceProfile,
  sampleSparkTurbulence,
} from "#/shared/ui/effects/domDisintegrate/sparkTurbulence";

describe("sampleSparkTurbulence", () => {
  it("varies forces per particle seed and spawn position", () => {
    const firstProfile = createSparkTurbulenceProfile(12);
    const secondProfile = createSparkTurbulenceProfile(512);
    const first = sampleSparkTurbulence(
      {
        originX: 12,
        originY: 40,
        timeSinceRelease: 0.35,
        turbulenceSeed: 12,
        verticalTravel: 28,
      },
      firstProfile,
    );
    const second = sampleSparkTurbulence(
      {
        originX: 84,
        originY: 16,
        timeSinceRelease: 0.35,
        turbulenceSeed: 512,
        verticalTravel: 28,
      },
      secondProfile,
    );

    expect(Math.hypot(first.forceX, first.forceY)).toBeLessThan(1.4);
    expect(Math.hypot(second.forceX, second.forceY)).toBeLessThan(1.4);
    expect(first.forceX).not.toBeCloseTo(second.forceX, 2);
  });

  it("ramps lateral sway with vertical travel", () => {
    const profile = createSparkTurbulenceProfile(5);
    const noRise = sampleSparkTurbulence(
      {
        originX: 20,
        originY: 40,
        timeSinceRelease: 0.55,
        turbulenceSeed: 5,
        verticalTravel: 0,
      },
      profile,
    );
    const risen = sampleSparkTurbulence(
      {
        originX: 20,
        originY: 40,
        timeSinceRelease: 0.55,
        turbulenceSeed: 5,
        verticalTravel: 58,
      },
      profile,
    );

    expect(Math.abs(risen.forceX)).toBeGreaterThan(Math.abs(noRise.forceX));
  });

  it("evolves turbulence over time", () => {
    const profile = createSparkTurbulenceProfile(5);
    const early = sampleSparkTurbulence(
      {
        originX: 10,
        originY: 20,
        timeSinceRelease: 0.1,
        turbulenceSeed: 5,
        verticalTravel: 30,
      },
      profile,
    );
    const later = sampleSparkTurbulence(
      {
        originX: 10,
        originY: 20,
        timeSinceRelease: 0.85,
        turbulenceSeed: 5,
        verticalTravel: 30,
      },
      profile,
    );

    expect(early.forceX).not.toBeCloseTo(later.forceX, 2);
  });
});
