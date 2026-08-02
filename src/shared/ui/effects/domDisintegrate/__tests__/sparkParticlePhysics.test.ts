import { describe, expect, it } from "vitest";

import {
  getSparkDriftDirection,
  getSparkLiftFactor,
} from "#/shared/ui/effects/domDisintegrate/sparkParticlePhysics";

describe("sparkParticlePhysics", () => {
  it("points drift up-right when wind blows from left to right", () => {
    const drift = getSparkDriftDirection(14, -8);

    expect(drift.driftX).toBeGreaterThan(0);
    expect(drift.driftY).toBeLessThan(0);
  });

  it("varies lift per particle while keeping a shared wind field", () => {
    const firstLift = getSparkLiftFactor(12);
    const secondLift = getSparkLiftFactor(512);

    expect(firstLift).toBeGreaterThan(0.6);
    expect(firstLift).toBeLessThan(1.3);
    expect(secondLift).toBeGreaterThan(0.6);
    expect(secondLift).toBeLessThan(1.3);
    expect(firstLift).not.toBeCloseTo(secondLift, 1);
  });
});
