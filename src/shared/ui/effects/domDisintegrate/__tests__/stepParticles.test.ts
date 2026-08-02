import { describe, expect, it } from "vitest";

import { createDisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/createDisintegrateParticle";
import { resolveDomDisintegrateOptions } from "#/shared/ui/effects/domDisintegrate/resolveDomDisintegrateOptions";
import { stepParticles } from "#/shared/ui/effects/domDisintegrate/stepParticles";

const windyOptions = resolveDomDisintegrateOptions({
  particleMotionMode: "windy",
  maxVelocity: 80,
  windX: 12,
  windY: -6,
});

const splatOptions = (
  overrides: Parameters<typeof resolveDomDisintegrateOptions>[0],
) => resolveDomDisintegrateOptions(overrides);

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

    stepParticles(
      [particle],
      1 / 60,
      1 / 60,
      splatOptions({
        particleMotionMode: "splat",
        gravity: 0,
        windX: 0,
        windY: 0,
      }),
    );
    const positionAfterOneFrame = particle.x;

    const secondParticle = {
      ...particle,
      x: 10,
      y: 10,
      vx: 60,
      vy: 0,
    };
    stepParticles(
      [secondParticle],
      1 / 120,
      1 / 120,
      splatOptions({
        particleMotionMode: "splat",
        gravity: 0,
        windX: 0,
        windY: 0,
      }),
    );
    stepParticles(
      [secondParticle],
      1 / 120,
      1 / 60,
      splatOptions({
        particleMotionMode: "splat",
        gravity: 0,
        windX: 0,
        windY: 0,
      }),
    );

    expect(secondParticle.x).toBeCloseTo(positionAfterOneFrame, 2);
  });

  it("diverges windy particles with different turbulence seeds", () => {
    const first = createDisintegrateParticle({
      x: 20,
      y: 40,
      color: "rgb(255, 255, 255)",
      alpha: 1,
      surfaceWidth: 120,
      surfaceHeight: 60,
      options: windyOptions,
    });
    const second = createDisintegrateParticle({
      x: 90,
      y: 40,
      color: "rgb(255, 255, 255)",
      alpha: 1,
      surfaceWidth: 120,
      surfaceHeight: 60,
      options: windyOptions,
    });
    first.releaseTime = 0;
    second.releaseTime = 0;
    first.turbulenceSeed = 11;
    second.turbulenceSeed = 907;

    for (let frame = 1; frame <= 120; frame += 1) {
      stepParticles([first, second], 1 / 60, frame / 60, windyOptions);
    }

    expect(Math.abs(first.x - second.x)).toBeGreaterThan(50);
  });

  it("sways more laterally after rising farther", () => {
    const particle = createDisintegrateParticle({
      x: 20,
      y: 40,
      color: "rgb(255, 255, 255)",
      alpha: 1,
      surfaceWidth: 120,
      surfaceHeight: 60,
      options: windyOptions,
    });
    particle.releaseTime = 0;
    particle.vx = 4;
    particle.vy = -42;
    particle.drag = 0.97;
    particle.turbulenceSeed = 33;

    let earlyLateralDelta = 0;
    let lateralAtPeakRise = 0;
    let peakVerticalTravel = 0;

    for (let frame = 1; frame <= 120; frame += 1) {
      stepParticles([particle], 1 / 60, frame / 60, windyOptions);

      const verticalTravel = Math.max(0, particle.originY - particle.y);
      const lateralDelta = Math.abs(particle.x - particle.originX);

      if (frame <= 12) {
        earlyLateralDelta = Math.max(earlyLateralDelta, lateralDelta);
      }

      if (verticalTravel > peakVerticalTravel) {
        peakVerticalTravel = verticalTravel;
        lateralAtPeakRise = lateralDelta;
      }
    }

    expect(peakVerticalTravel).toBeGreaterThan(10);
    expect(lateralAtPeakRise).toBeGreaterThan(earlyLateralDelta + 2);
  });

  it("keeps windy sparks rising with the global wind instead of falling", () => {
    const particle = createDisintegrateParticle({
      x: 30,
      y: 50,
      color: "rgb(255, 255, 255)",
      alpha: 1,
      surfaceWidth: 120,
      surfaceHeight: 60,
      options: {
        particleMotionMode: "windy",
        maxVelocity: 80,
        windX: 16,
        windY: -10,
        gravity: 320,
      },
    });
    particle.releaseTime = 0;
    particle.turbulenceSeed = 44;

    const yPositions: number[] = [particle.y];
    for (let frame = 1; frame <= 150; frame += 1) {
      stepParticles(
        [particle],
        1 / 60,
        frame / 60,
        resolveDomDisintegrateOptions({
          particleMotionMode: "windy",
          maxVelocity: 80,
          windX: 16,
          windY: -10,
          gravity: 320,
        }),
      );
      yPositions.push(particle.y);
    }

    expect(particle.y).toBeLessThan(particle.originY);
    expect(particle.x).toBeGreaterThan(particle.originX);
    expect(Math.min(...yPositions)).toBeLessThan(particle.originY - 8);
    expect(particle.vy).toBeLessThanOrEqual(8);
  });
});
