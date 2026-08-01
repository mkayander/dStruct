import { resolveThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/resolveThanosDisintegrateOptions";
import type { ThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/types";

/** Extra canvas margin so flying particles are not clipped by the surface bounds. */
export const getParticleCanvasPadding = (
  options?: ThanosDisintegrateOptions,
): number => {
  const resolvedOptions = resolveThanosDisintegrateOptions(options);
  const duration = resolvedOptions.maxDuration;
  const maxTravel =
    resolvedOptions.maxVelocity * duration +
    0.5 * resolvedOptions.gravity * duration * duration +
    Math.abs(resolvedOptions.windX) * duration +
    Math.abs(resolvedOptions.windY) * duration;

  return Math.ceil(maxTravel + resolvedOptions.particleSize * 4);
};
