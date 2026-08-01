import type { DisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/types";

const RELEASE_JITTER_SECONDS = 0.03;

/** Staggers particle release times by distance from the click origin. */
export const applyWaveOrigin = (
  particles: DisintegrateParticle[],
  origin: { x: number; y: number },
  waveSpeedPxPerSecond: number,
): number => {
  let maxReleaseTime = 0;

  for (const particle of particles) {
    const distance = Math.hypot(particle.x - origin.x, particle.y - origin.y);
    const releaseTime =
      distance / waveSpeedPxPerSecond + Math.random() * RELEASE_JITTER_SECONDS;
    particle.releaseTime = releaseTime;
    maxReleaseTime = Math.max(maxReleaseTime, releaseTime);
  }

  return maxReleaseTime;
};
