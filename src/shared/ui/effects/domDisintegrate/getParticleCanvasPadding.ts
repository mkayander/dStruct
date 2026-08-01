import { resolveDomDisintegrateOptions } from "#/shared/ui/effects/domDisintegrate/resolveDomDisintegrateOptions";
import {
  SPARK_TRAVEL_PADDING,
  SPARK_UPWARD_TRAVEL_FACTOR,
} from "#/shared/ui/effects/domDisintegrate/sparkParticlePhysics";
import type {
  DomDisintegrateOptions,
  ResolvedDomDisintegrateOptions,
} from "#/shared/ui/effects/domDisintegrate/types";

const computeParticleMaxTravel = (
  resolvedOptions: ResolvedDomDisintegrateOptions,
): number => {
  const duration = resolvedOptions.maxDuration;
  const baseTravel =
    resolvedOptions.maxVelocity * duration +
    0.5 * resolvedOptions.gravity * duration * duration +
    Math.abs(resolvedOptions.windX) * duration +
    Math.abs(resolvedOptions.windY) * duration;

  if (resolvedOptions.particleMotionMode === "windy") {
    return (
      baseTravel * 1.65 +
      resolvedOptions.maxVelocity * SPARK_UPWARD_TRAVEL_FACTOR +
      SPARK_TRAVEL_PADDING
    );
  }

  return baseTravel;
};

/** Max distance a particle can travel from its origin during the animation. */
export const getParticleMaxTravel = (
  options?: DomDisintegrateOptions,
): number => computeParticleMaxTravel(resolveDomDisintegrateOptions(options));

/** Margin around each chunk hole on the particle mask so flying pixels stay visible. */
export const getParticleRevealMargin = (
  options?: DomDisintegrateOptions,
): number => {
  const resolvedOptions = resolveDomDisintegrateOptions(options);
  return Math.ceil(
    computeParticleMaxTravel(resolvedOptions) + resolvedOptions.particleSize,
  );
};

/** Extra canvas margin so flying particles are not clipped by the surface bounds. */
export const getParticleCanvasPadding = (
  options?: DomDisintegrateOptions,
): number => {
  const resolvedOptions = resolveDomDisintegrateOptions(options);
  return Math.ceil(
    computeParticleMaxTravel(resolvedOptions) +
      resolvedOptions.particleSize * 4,
  );
};
