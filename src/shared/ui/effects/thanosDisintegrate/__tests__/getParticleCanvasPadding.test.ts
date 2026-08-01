import { describe, expect, it } from "vitest";

import { THANOS_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/thanosDisintegrate/constants";
import {
  getParticleCanvasPadding,
  getParticleMaxTravel,
  getParticleRevealMargin,
} from "#/shared/ui/effects/thanosDisintegrate/getParticleCanvasPadding";

describe("getParticleCanvasPadding", () => {
  it("scales with physics options so particles can travel outside the surface", () => {
    const padding = getParticleCanvasPadding(THANOS_DISINTEGRATE_DEFAULTS);

    expect(padding).toBeGreaterThan(200);
  });

  it("returns a smaller margin when motion is reduced", () => {
    const padding = getParticleCanvasPadding({
      maxVelocity: 40,
      gravity: 40,
      maxDuration: 0.5,
      windX: 0,
      windY: 0,
    });

    expect(padding).toBeLessThan(80);
  });

  it("keeps reveal margin within canvas padding", () => {
    const options = THANOS_DISINTEGRATE_DEFAULTS;
    const padding = getParticleCanvasPadding(options);
    const revealMargin = getParticleRevealMargin(options);

    expect(getParticleMaxTravel(options)).toBeGreaterThan(0);
    expect(revealMargin).toBeLessThan(padding);
  });
});
