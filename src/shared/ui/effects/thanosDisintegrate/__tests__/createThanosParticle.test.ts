import { describe, expect, it } from "vitest";

import { createThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/createThanosParticle";

const baseInput = {
  x: 50,
  y: 25,
  color: "rgb(255, 255, 255)",
  alpha: 1,
  surfaceWidth: 100,
  surfaceHeight: 50,
};

describe("createThanosParticle", () => {
  it("biases splat particles away from the surface center", () => {
    const particle = createThanosParticle({
      ...baseInput,
      x: 80,
      y: 10,
      options: {
        particleMotionMode: "splat",
        maxVelocity: 100,
        windX: 0,
        windY: 0,
      },
    });

    expect(particle.vx).toBeGreaterThan(20);
    expect(particle.turbulenceSeed).toBeGreaterThanOrEqual(0);
  });

  it("biases windy particles along the wind direction instead of radial burst", () => {
    const particles = Array.from({ length: 24 }, () =>
      createThanosParticle({
        ...baseInput,
        options: {
          particleMotionMode: "windy",
          maxVelocity: 100,
          windX: 80,
          windY: -10,
        },
      }),
    );

    const averageVelocityX =
      particles.reduce((sum, particle) => sum + particle.vx, 0) /
      particles.length;
    const averageSpeed =
      particles.reduce(
        (sum, particle) => sum + Math.hypot(particle.vx, particle.vy),
        0,
      ) / particles.length;

    expect(averageVelocityX).toBeGreaterThan(10);
    expect(averageSpeed).toBeLessThan(80);
  });
});
