import { createDisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/createDisintegrateParticle";
import { resolveDomDisintegrateOptions } from "#/shared/ui/effects/domDisintegrate/resolveDomDisintegrateOptions";
import type {
  DisintegrateParticle,
  DomDisintegrateOptions,
} from "#/shared/ui/effects/domDisintegrate/types";

export const createParticlesFromImageData = (
  imageData: ImageData,
  options?: DomDisintegrateOptions,
): DisintegrateParticle[] => {
  const resolvedOptions = resolveDomDisintegrateOptions(options);
  const particles: DisintegrateParticle[] = [];
  const { data, width, height } = imageData;
  const { particleStep } = resolvedOptions;

  for (let y = 0; y < height; y += particleStep) {
    for (let x = 0; x < width; x += particleStep) {
      const index = (y * width + x) * 4;
      const alphaChannel = data[index + 3] ?? 0;
      if (alphaChannel < 12) {
        continue;
      }

      const red = data[index] ?? 0;
      const green = data[index + 1] ?? 0;
      const blue = data[index + 2] ?? 0;

      particles.push(
        createDisintegrateParticle({
          x,
          y,
          color: `rgb(${red}, ${green}, ${blue})`,
          alpha: alphaChannel / 255,
          surfaceWidth: width,
          surfaceHeight: height,
          options: resolvedOptions,
        }),
      );
    }
  }

  return particles;
};
