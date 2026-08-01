import { THANOS_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/thanosDisintegrate/constants";
import { createThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/createThanosParticle";
import type {
  ResolvedThanosDisintegrateOptions,
  ThanosDisintegrateOptions,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";

const resolveOptions = (
  options?: ThanosDisintegrateOptions,
): ResolvedThanosDisintegrateOptions => ({
  ...THANOS_DISINTEGRATE_DEFAULTS,
  ...options,
});

export const createParticlesFromImageData = (
  imageData: ImageData,
  options?: ThanosDisintegrateOptions,
): ThanosParticle[] => {
  const resolvedOptions = resolveOptions(options);
  const particles: ThanosParticle[] = [];
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
        createThanosParticle({
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
