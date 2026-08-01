import { describe, expect, it } from "vitest";

import {
  sampleSparkFlutter,
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

  it("produces bounded flutter forces per particle", () => {
    const first = sampleSparkFlutter(0.2, 12);
    const second = sampleSparkFlutter(0.2, 84);

    expect(Math.hypot(first.forceX, first.forceY)).toBeLessThan(1.2);
    expect(Math.hypot(second.forceX, second.forceY)).toBeLessThan(1.2);
    expect(first.forceX).not.toBeCloseTo(second.forceX, 2);
  });

  it("evolves flutter over time for wavering spark motion", () => {
    const early = sampleSparkFlutter(0.1, 5);
    const later = sampleSparkFlutter(0.8, 5);

    expect(early.forceX).not.toBeCloseTo(later.forceX, 2);
    expect(early.forceY).not.toBeCloseTo(later.forceY, 2);
  });
});
