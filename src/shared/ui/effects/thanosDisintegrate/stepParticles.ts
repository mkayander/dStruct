import { THANOS_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/thanosDisintegrate/constants";
import type { ThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/types";
import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

type ResolvedThanosOptions = Required<
  Omit<ThanosDisintegrateOptions, "origin">
>;

const resolveOptions = (
  options?: ThanosDisintegrateOptions,
): ResolvedThanosOptions => ({
  ...THANOS_DISINTEGRATE_DEFAULTS,
  ...options,
});

const applyDrag = (velocity: number, drag: number, deltaSeconds: number) =>
  velocity * Math.pow(drag, deltaSeconds * 60);

const updateFadeAlpha = (
  particle: ThanosParticle,
  timeSinceRelease: number,
): void => {
  const progress = timeSinceRelease / particle.fadeDuration;
  if (progress <= particle.fadeStart) {
    particle.alpha = particle.baseAlpha;
    return;
  }

  const fadeProgress =
    (progress - particle.fadeStart) / Math.max(0.001, 1 - particle.fadeStart);
  particle.alpha = particle.baseAlpha * Math.max(0, 1 - fadeProgress);
};

/** Advances particle physics using delta time (stable on high-refresh displays). */
export const stepParticles = (
  particles: ThanosParticle[],
  deltaSeconds: number,
  elapsedSeconds: number,
  options?: ThanosDisintegrateOptions,
): number => {
  const resolvedOptions = resolveOptions(options);
  let visibleCount = 0;

  for (const particle of particles) {
    if (elapsedSeconds < particle.releaseTime) {
      visibleCount += 1;
      continue;
    }

    const timeSinceRelease = elapsedSeconds - particle.releaseTime;
    particle.vx = applyDrag(particle.vx, particle.drag, deltaSeconds);
    particle.vy = applyDrag(particle.vy, particle.drag, deltaSeconds);
    particle.vx += resolvedOptions.windX * deltaSeconds;
    particle.vy +=
      resolvedOptions.gravity * deltaSeconds +
      resolvedOptions.windY * deltaSeconds;
    particle.x += particle.vx * deltaSeconds;
    particle.y += particle.vy * deltaSeconds;
    particle.rotation += particle.rotationSpeed * deltaSeconds;
    updateFadeAlpha(particle, timeSinceRelease);

    if (particle.alpha > 0.01) {
      visibleCount += 1;
    }
  }

  return visibleCount;
};
