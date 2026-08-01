import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

const FADE_FRAMES_AFTER_RELEASE = 8;

/** Returns 0–1 progress of how much of the surface has been consumed by the wave. */
export const getWaveDisintegrationProgress = (
  particles: ThanosParticle[],
  frame: number,
): number => {
  if (particles.length === 0) {
    return 1;
  }

  let releasedWeight = 0;
  let totalWeight = 0;

  for (const particle of particles) {
    totalWeight += particle.baseAlpha;
    if (frame < particle.releaseFrame) {
      continue;
    }

    const framesSinceRelease = frame - particle.releaseFrame;
    const releaseProgress = Math.min(
      1,
      framesSinceRelease / FADE_FRAMES_AFTER_RELEASE,
    );
    releasedWeight += particle.baseAlpha * releaseProgress;
  }

  if (totalWeight <= 0) {
    return 1;
  }

  return releasedWeight / totalWeight;
};
