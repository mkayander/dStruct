import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

/** Staggers particle release frames by distance from the click origin. */
export const applyWaveOrigin = (
  particles: ThanosParticle[],
  origin: { x: number; y: number },
  waveSpeed: number,
): number => {
  let maxReleaseFrame = 0;

  for (const particle of particles) {
    const distance = Math.hypot(particle.x - origin.x, particle.y - origin.y);
    const releaseFrame = Math.floor(distance / waveSpeed);
    particle.releaseFrame = releaseFrame;
    maxReleaseFrame = Math.max(maxReleaseFrame, releaseFrame);
  }

  return maxReleaseFrame;
};
