import { describe, expect, it } from "vitest";

import { createDisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/createDisintegrateParticle";

const baseInput = {
  x: 50,
  y: 25,
  color: "rgb(255, 255, 255)",
  alpha: 1,
  surfaceWidth: 100,
  surfaceHeight: 50,
};

describe("createDisintegrateParticle", () => {
  it("biases splat particles away from the surface center", () => {
    const particle = createDisintegrateParticle({
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

  it("launches windy particles upward like fire sparks", () => {
    const particles = Array.from({ length: 24 }, () =>
      createDisintegrateParticle({
        ...baseInput,
        options: {
          particleMotionMode: "windy",
          maxVelocity: 100,
          windX: 14,
          windY: -8,
        },
      }),
    );

    const averageVelocityY =
      particles.reduce((sum, particle) => sum + particle.vy, 0) /
      particles.length;
    const averageSpeed =
      particles.reduce(
        (sum, particle) => sum + Math.hypot(particle.vx, particle.vy),
        0,
      ) / particles.length;

    expect(averageVelocityY).toBeLessThan(-8);
    expect(averageSpeed).toBeGreaterThan(20);
    expect(averageSpeed).toBeLessThan(105);

    const averageVelocityX =
      particles.reduce((sum, particle) => sum + particle.vx, 0) /
      particles.length;
    expect(averageVelocityX).toBeGreaterThan(4);
  });
});
