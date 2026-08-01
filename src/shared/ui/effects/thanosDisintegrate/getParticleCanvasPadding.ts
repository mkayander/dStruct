import { resolveThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/resolveThanosDisintegrateOptions";
import type { ThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/types";

/** Max distance a particle can travel from its origin during the animation. */
export const getParticleMaxTravel = (
  options?: ThanosDisintegrateOptions,
): number => {
  const resolvedOptions = resolveThanosDisintegrateOptions(options);
  const duration = resolvedOptions.maxDuration;
  const baseTravel =
    resolvedOptions.maxVelocity * duration +
    0.5 * resolvedOptions.gravity * duration * duration +
    Math.abs(resolvedOptions.windX) * duration +
    Math.abs(resolvedOptions.windY) * duration;

  if (resolvedOptions.particleMotionMode === "windy") {
    return baseTravel * 1.65 + 48;
  }

  return baseTravel;
};

/** Margin around each chunk hole on the particle mask so flying pixels stay visible. */
export const getParticleRevealMargin = (
  options?: ThanosDisintegrateOptions,
): number => {
  const resolvedOptions = resolveThanosDisintegrateOptions(options);
  return Math.ceil(
    getParticleMaxTravel(resolvedOptions) + resolvedOptions.particleSize,
  );
};

/** Extra canvas margin so flying particles are not clipped by the surface bounds. */
export const getParticleCanvasPadding = (
  options?: ThanosDisintegrateOptions,
): number => {
  const resolvedOptions = resolveThanosDisintegrateOptions(options);
  return Math.ceil(
    getParticleMaxTravel(resolvedOptions) + resolvedOptions.particleSize * 4,
  );
};
