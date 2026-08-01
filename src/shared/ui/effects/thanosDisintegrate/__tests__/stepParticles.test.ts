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

  it("curves windy particles with turbulent flow instead of a straight drift", () => {
    const particle = createThanosParticle({
      x: 20,
      y: 20,
      color: "rgb(255, 255, 255)",
      alpha: 1,
      surfaceWidth: 120,
      surfaceHeight: 60,
      options: {
        particleMotionMode: "windy",
        maxVelocity: 40,
        windX: 60,
        windY: -8,
        gravity: 40,
      },
    });
    particle.releaseTime = 0;
    particle.vx = 10;
    particle.vy = 0;
    particle.drag = 1;
    particle.turbulenceSeed = 42;

    const positions: Array<{ x: number; y: number }> = [
      { x: particle.x, y: particle.y },
    ];
    for (let frame = 1; frame <= 90; frame += 1) {
      stepParticles([particle], 1 / 60, frame / 60, {
        particleMotionMode: "windy",
        windX: 60,
        windY: -8,
        gravity: 40,
      });
      positions.push({ x: particle.x, y: particle.y });
    }

    const start = positions[0];
    const end = positions[positions.length - 1];
    const midpoint = positions[Math.floor(positions.length / 2)];
    const straightLineMidY = ((start?.y ?? 0) + (end?.y ?? 0)) / 2;

    expect(end?.x).toBeGreaterThan((start?.x ?? 0) + 4);
    expect(Math.abs((midpoint?.y ?? 0) - straightLineMidY)).toBeGreaterThan(
      0.25,
    );
  });
});
