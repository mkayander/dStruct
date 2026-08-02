import { resolveDomDisintegrateOptions } from "#/shared/ui/effects/domDisintegrate/resolveDomDisintegrateOptions";
import { computeWindyParticleMaxTravel } from "#/shared/ui/effects/domDisintegrate/sparkParticlePhysics";
import type {
  DomDisintegrateOptions,
  ResolvedDomDisintegrateOptions,
} from "#/shared/ui/effects/domDisintegrate/types";

const computeSplatParticleMaxTravel = (
  resolvedOptions: ResolvedDomDisintegrateOptions,
): number => {
  const duration = resolvedOptions.maxDuration;

  return (
    resolvedOptions.maxVelocity * duration +
    0.5 * resolvedOptions.gravity * duration * duration +
    Math.abs(resolvedOptions.windX) * duration +
    Math.abs(resolvedOptions.windY) * duration
  );
};

const computeParticleMaxTravel = (
  resolvedOptions: ResolvedDomDisintegrateOptions,
): number => {
  if (resolvedOptions.particleMotionMode === "windy") {
    return computeWindyParticleMaxTravel(resolvedOptions);
  }

  return computeSplatParticleMaxTravel(resolvedOptions);
};

/** Max distance a particle can travel from its origin during the animation. */
export const getParticleMaxTravel = (
  options?: DomDisintegrateOptions | ResolvedDomDisintegrateOptions,
): number => computeParticleMaxTravel(resolveDomDisintegrateOptions(options));

/** Margin around each chunk hole on the particle mask so flying pixels stay visible. */
export const getParticleRevealMargin = (
  options?: DomDisintegrateOptions | ResolvedDomDisintegrateOptions,
): number => {
  const resolvedOptions = resolveDomDisintegrateOptions(options);
  return Math.ceil(
    computeParticleMaxTravel(resolvedOptions) + resolvedOptions.particleSize,
  );
};

/** Extra canvas margin so flying particles are not clipped by the surface bounds. */
export const getParticleCanvasPadding = (
  options?: DomDisintegrateOptions | ResolvedDomDisintegrateOptions,
): number => {
  const resolvedOptions = resolveDomDisintegrateOptions(options);
  return Math.ceil(
    computeParticleMaxTravel(resolvedOptions) +
      resolvedOptions.particleSize * 4,
  );
};
