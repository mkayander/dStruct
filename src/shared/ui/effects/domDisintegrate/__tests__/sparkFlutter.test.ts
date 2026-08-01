import { describe, expect, it } from "vitest";

import { sampleSparkFlutter } from "#/shared/ui/effects/domDisintegrate/sparkFlutter";

describe("sampleSparkFlutter", () => {
  it("produces bounded, per-particle flutter forces", () => {
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
