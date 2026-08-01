import { describe, expect, it } from "vitest";

import { createTestDisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/__tests__/createTestDisintegrateParticle";
import { getWaveDisintegrationProgress } from "#/shared/ui/effects/domDisintegrate/getWaveDisintegrationProgress";

describe("getWaveDisintegrationProgress", () => {
  it("ramps from 0 before the wave to 1 after all particles release", () => {
    const particles = [
      createTestDisintegrateParticle({ releaseTime: 0 }),
      createTestDisintegrateParticle({ releaseTime: 0.5 }),
    ];

    expect(getWaveDisintegrationProgress(particles, 0)).toBe(0);
    expect(getWaveDisintegrationProgress(particles, 1)).toBe(1);
  });
});
