import { THANOS_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/thanosDisintegrate/constants";
import type {
  ThanosDisintegrateOptions,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";

type ResolvedThanosOptions = Required<Omit<ThanosDisintegrateOptions, "origin">>;

const resolveOptions = (
  options?: ThanosDisintegrateOptions,
): ResolvedThanosOptions => ({
  ...THANOS_DISINTEGRATE_DEFAULTS,
  ...options,
});

export const createParticlesFromImageData = (
  imageData: ImageData,
  options?: ThanosDisintegrateOptions,
): ThanosParticle[] => {
  const { particleStep, particleSize, maxVelocity, windX, windY } =
    resolveOptions(options);

  const particles: ThanosParticle[] = [];
  const { data, width, height } = imageData;

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

      particles.push({
        x,
        y,
        vx: (Math.random() - 0.35) * maxVelocity + windX,
        vy: (Math.random() - 0.55) * maxVelocity + windY,
        color: `rgb(${red}, ${green}, ${blue})`,
        alpha: alphaChannel / 255,
        baseAlpha: alphaChannel / 255,
        size: particleSize + Math.random(),
        decay: 0.012 + Math.random() * 0.02,
        releaseFrame: 0,
      });
    }
  }

  return particles;
};
