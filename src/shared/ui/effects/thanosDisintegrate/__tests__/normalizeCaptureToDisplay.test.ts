import { describe, expect, it } from "vitest";

import { normalizeCaptureToDisplay } from "#/shared/ui/effects/thanosDisintegrate/normalizeCaptureToDisplay";
import { scaleParticleCoordinates } from "#/shared/ui/effects/thanosDisintegrate/scaleParticleCoordinates";
import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

describe("normalizeCaptureToDisplay", () => {
  it("downscales hi-dpi captures to css pixel dimensions", () => {
    const source = document.createElement("canvas");
    source.width = 200;
    source.height = 100;

    const normalized = normalizeCaptureToDisplay(source, 100, 50);

    expect(normalized.width).toBe(100);
    expect(normalized.height).toBe(50);
  });
});

describe("scaleParticleCoordinates", () => {
  it("scales origin and velocity fields used for hole punching", () => {
    const particle: ThanosParticle = {
      x: 10,
      y: 20,
      originX: 10,
      originY: 20,
      vx: 4,
      vy: -2,
      color: "rgb(0, 0, 0)",
      alpha: 1,
      baseAlpha: 1,
      size: 2,
      rotation: 0,
      rotationSpeed: 0,
      drag: 0.96,
      fadeStart: 0.5,
      fadeDuration: 0.4,
      releaseTime: 0,
    };

    scaleParticleCoordinates([particle], 0.5, 0.5);

    expect(particle.originX).toBe(5);
    expect(particle.originY).toBe(10);
    expect(particle.vx).toBe(2);
    expect(particle.vy).toBe(-1);
  });
});
