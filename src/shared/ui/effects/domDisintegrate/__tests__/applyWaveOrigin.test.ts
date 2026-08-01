import { describe, expect, it } from "vitest";

import { createTestDisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/__tests__/createTestDisintegrateParticle";
import { applyWaveOrigin } from "#/shared/ui/effects/domDisintegrate/applyWaveOrigin";

describe("applyWaveOrigin", () => {
  it("delays particles farther from the origin", () => {
    const particles = [
      createTestDisintegrateParticle({ x: 0, y: 0, originX: 0, originY: 0 }),
      createTestDisintegrateParticle({ x: 30, y: 0, originX: 30, originY: 0 }),
    ];

    const maxReleaseTime = applyWaveOrigin(particles, { x: 0, y: 0 }, 10);

    expect(particles[0]?.releaseTime).toBeGreaterThanOrEqual(0);
    expect(particles[0]?.releaseTime).toBeLessThan(0.05);
    expect(particles[1]?.releaseTime).toBeGreaterThan(2.5);
    expect(maxReleaseTime).toBe(particles[1]?.releaseTime);
  });
});
