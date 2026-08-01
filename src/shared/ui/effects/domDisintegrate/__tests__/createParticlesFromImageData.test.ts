import { describe, expect, it } from "vitest";

import { createParticlesFromImageData } from "#/shared/ui/effects/domDisintegrate/createParticlesFromImageData";

describe("createParticlesFromImageData", () => {
  it("skips transparent pixels and samples opaque ones", () => {
    const imageData = new ImageData(4, 4);
    for (let index = 0; index < imageData.data.length; index += 4) {
      imageData.data[index] = 10;
      imageData.data[index + 1] = 20;
      imageData.data[index + 2] = 30;
      imageData.data[index + 3] = 0;
    }

    imageData.data[0] = 255;
    imageData.data[1] = 128;
    imageData.data[2] = 64;
    imageData.data[3] = 255;

    const particles = createParticlesFromImageData(imageData, {
      particleStep: 1,
      particleSize: 2,
      maxVelocity: 1,
      windX: 0,
      windY: 0,
      gravity: 0,
    });

    expect(particles).toHaveLength(1);
    expect(particles[0]).toMatchObject({
      x: 0,
      y: 0,
      originX: 0,
      originY: 0,
      color: "rgb(255, 128, 64)",
      alpha: 1,
    });
  });
});
