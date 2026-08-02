import { describe, expect, it } from "vitest";

import { DOM_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/domDisintegrate/constants";
import {
  getParticleCanvasPadding,
  getParticleMaxTravel,
  getParticleRevealMargin,
} from "#/shared/ui/effects/domDisintegrate/getParticleCanvasPadding";

describe("getParticleCanvasPadding", () => {
  it("scales with physics options so particles can travel outside the surface", () => {
    const padding = getParticleCanvasPadding(DOM_DISINTEGRATE_DEFAULTS);

    expect(padding).toBeGreaterThan(200);
  });

  it("uses windy-specific travel bounds instead of the legacy inflated formula", () => {
    const windyPadding = getParticleCanvasPadding({
      ...DOM_DISINTEGRATE_DEFAULTS,
      particleMotionMode: "windy",
    });

    expect(windyPadding).toBeGreaterThan(400);
    expect(windyPadding).toBeLessThan(650);
  });

  it("returns a smaller margin when motion is reduced", () => {
    const padding = getParticleCanvasPadding({
      particleMotionMode: "splat",
      maxVelocity: 40,
      gravity: 40,
      maxDuration: 0.5,
      windX: 0,
      windY: 0,
    });

    expect(padding).toBeLessThan(80);
  });

  it("keeps reveal margin within canvas padding", () => {
    const options = DOM_DISINTEGRATE_DEFAULTS;
    const padding = getParticleCanvasPadding(options);
    const revealMargin = getParticleRevealMargin(options);

    expect(getParticleMaxTravel(options)).toBeGreaterThan(0);
    expect(revealMargin).toBeLessThan(padding);
  });
});
