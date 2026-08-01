import { describe, expect, it } from "vitest";

import { createDisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/createDisintegrateParticle";
import { stepParticles } from "#/shared/ui/effects/domDisintegrate/stepParticles";

describe("stepParticles", () => {
  it("uses delta time so motion is independent of frame rate", () => {
    const particle = createDisintegrateParticle({
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

  it("zig-zags laterally while rising", () => {
    const particle = createDisintegrateParticle({
      x: 20,
      y: 40,
      color: "rgb(255, 255, 255)",
      alpha: 1,
      surfaceWidth: 120,
      surfaceHeight: 60,
      options: {
        particleMotionMode: "windy",
        maxVelocity: 80,
        windX: 0,
        windY: 0,
        gravity: 240,
      },
    });
    particle.releaseTime = 0;
    particle.vx = 0;
    particle.vy = -50;
    particle.drag = 0.97;
    particle.turbulenceSeed = 17;

    const xPositions: number[] = [particle.x];
    const yPositions: number[] = [particle.y];
    for (let frame = 1; frame <= 200; frame += 1) {
      stepParticles([particle], 1 / 60, frame / 60, {
        particleMotionMode: "windy",
        windX: 0,
        windY: 0,
        gravity: 240,
      });
      xPositions.push(particle.x);
      yPositions.push(particle.y);
    }

    const xDeltas = xPositions
      .slice(1)
      .map((xPosition, index) => xPosition - xPositions[index]!);
    const directionChanges = xDeltas
      .slice(1)
      .filter(
        (delta, index) => Math.sign(delta) !== Math.sign(xDeltas[index]!),
      ).length;
    const lateralSpread = Math.max(...xPositions) - Math.min(...xPositions);
    const peakAltitude = Math.min(...yPositions);

    expect(directionChanges).toBeGreaterThanOrEqual(10);
    expect(lateralSpread).toBeGreaterThan(24);
    expect(peakAltitude).toBeLessThan(40 - 12);
  });
});
