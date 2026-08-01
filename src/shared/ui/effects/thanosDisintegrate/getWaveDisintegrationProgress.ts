import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

const FADE_SECONDS_AFTER_RELEASE = 0.12;

/** Returns 0–1 progress of how much of the surface has been consumed by the wave. */
export const getWaveDisintegrationProgress = (
  particles: ThanosParticle[],
  elapsedSeconds: number,
): number => {
  if (particles.length === 0) {
    return 1;
  }

  let releasedWeight = 0;
  let totalWeight = 0;

  for (const particle of particles) {
    totalWeight += particle.baseAlpha;
    if (elapsedSeconds < particle.releaseTime) {
      continue;
    }

    const secondsSinceRelease = elapsedSeconds - particle.releaseTime;
    const releaseProgress = Math.min(
      1,
      secondsSinceRelease / FADE_SECONDS_AFTER_RELEASE,
    );
    releasedWeight += particle.baseAlpha * releaseProgress;
  }

  if (totalWeight <= 0) {
    return 1;
  }

  return releasedWeight / totalWeight;
};
