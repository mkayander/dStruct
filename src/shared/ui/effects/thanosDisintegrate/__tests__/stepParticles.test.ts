import { describe, expect, it } from "vitest";

import { createThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/createThanosParticle";
import { stepParticles } from "#/shared/ui/effects/thanosDisintegrate/stepParticles";

describe("stepParticles", () => {
  it("uses delta time so motion is independent of frame rate", () => {
    const particle = createThanosParticle({
      x: 10,
      y: 10,
      color: "rgb(255, 255, 255)",
      alpha: 1,
      surfaceWidth: 100,
      surfaceHeight: 40,
      options: {
        gravity: 0,
        windX: 0,
        windY: 0,
        maxVelocity: 0,
      },
    });
    particle.releaseTime = 0;
    particle.vx = 60;
    particle.vy = 0;
    particle.drag = 1;

    stepParticles([particle], 1 / 60, 1 / 60);
    const positionAfterOneFrame = particle.x;

    const secondParticle = {
      ...particle,
      x: 10,
      y: 10,
      vx: 60,
      vy: 0,
    };
    stepParticles([secondParticle], 1 / 120, 1 / 120);
    stepParticles([secondParticle], 1 / 120, 1 / 60);

    expect(secondParticle.x).toBeCloseTo(positionAfterOneFrame, 2);
  });
});
