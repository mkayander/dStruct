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
        particleMotionMode: "splat",
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

    stepParticles([particle], 1 / 60, 1 / 60, {
      particleMotionMode: "splat",
      gravity: 0,
      windX: 0,
      windY: 0,
    });
    const positionAfterOneFrame = particle.x;

    const secondParticle = {
      ...particle,
      x: 10,
      y: 10,
      vx: 60,
      vy: 0,
    };
    stepParticles([secondParticle], 1 / 120, 1 / 120, {
      particleMotionMode: "splat",
      gravity: 0,
      windX: 0,
      windY: 0,
    });
    stepParticles([secondParticle], 1 / 120, 1 / 60, {
      particleMotionMode: "splat",
      gravity: 0,
      windX: 0,
      windY: 0,
    });

    expect(secondParticle.x).toBeCloseTo(positionAfterOneFrame, 2);
  });

  it("arcs windy particles upward before gravity pulls them down", () => {
    const particle = createThanosParticle({
      x: 20,
      y: 40,
      color: "rgb(255, 255, 255)",
      alpha: 1,
      surfaceWidth: 120,
      surfaceHeight: 60,
      options: {
        particleMotionMode: "windy",
        maxVelocity: 80,
        windX: 10,
        windY: -6,
        gravity: 240,
      },
    });
    particle.releaseTime = 0;
    particle.vx = 6;
    particle.vy = -40;
    particle.drag = 1;
    particle.turbulenceSeed = 42;

    const yPositions: number[] = [particle.y];
    for (let frame = 1; frame <= 120; frame += 1) {
      stepParticles([particle], 1 / 60, frame / 60, {
        particleMotionMode: "windy",
        windX: 10,
        windY: -6,
        gravity: 240,
      });
      yPositions.push(particle.y);
    }

    const lowestY = Math.min(...yPositions);
    const highestY = Math.max(...yPositions);

    expect(lowestY).toBeLessThan(40);
    expect(highestY).toBeGreaterThan(lowestY + 6);
  });
});
