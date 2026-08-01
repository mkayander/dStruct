import { describe, expect, it } from "vitest";

import {
  sampleWindFlow,
  sampleWindNoise2D,
} from "#/shared/ui/effects/thanosDisintegrate/windTurbulence";

describe("windTurbulence", () => {
  it("returns smooth, bounded noise values", () => {
    const samples = Array.from({ length: 20 }, (_, index) =>
      sampleWindNoise2D(index * 0.25, index * 0.1),
    );

    for (const value of samples) {
      expect(value).toBeGreaterThanOrEqual(-1.5);
      expect(value).toBeLessThanOrEqual(1.5);
    }

    expect(samples[1]).not.toBe(samples[0]);
  });

  it("produces nearby flow samples that are correlated but not identical", () => {
    const first = sampleWindFlow(40, 60, 0.2, 12);
    const nearby = sampleWindFlow(42, 61, 0.2, 12);
    const distant = sampleWindFlow(240, 180, 0.2, 12);

    expect(Math.hypot(first.forceX, first.forceY)).toBeGreaterThan(0.2);
    expect(Math.hypot(nearby.forceX, nearby.forceY)).toBeGreaterThan(0.2);
    expect(first.forceX).not.toBeCloseTo(distant.forceX, 1);
    expect(first.forceY).not.toBeCloseTo(distant.forceY, 1);
  });

  it("evolves the flow field over time", () => {
    const early = sampleWindFlow(80, 40, 0.1, 5);
    const later = sampleWindFlow(80, 40, 0.8, 5);

    expect(early.forceX).not.toBeCloseTo(later.forceX, 2);
    expect(early.forceY).not.toBeCloseTo(later.forceY, 2);
  });
});
