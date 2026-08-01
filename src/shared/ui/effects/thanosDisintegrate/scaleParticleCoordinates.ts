import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

export const scaleParticleCoordinates = (
  particles: ThanosParticle[],
  scaleX: number,
  scaleY: number,
): void => {
  if (scaleX === 1 && scaleY === 1) {
    return;
  }

  for (const particle of particles) {
    particle.x *= scaleX;
    particle.y *= scaleY;
  }
};
