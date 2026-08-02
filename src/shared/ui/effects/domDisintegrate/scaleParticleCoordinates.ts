import type { DisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/types";

export const scaleParticleCoordinates = (
  particles: DisintegrateParticle[],
  scaleX: number,
  scaleY: number,
): void => {
  if (scaleX === 1 && scaleY === 1) {
    return;
  }

  for (const particle of particles) {
    particle.x *= scaleX;
    particle.y *= scaleY;
    particle.originX *= scaleX;
    particle.originY *= scaleY;
    particle.vx *= scaleX;
    particle.vy *= scaleY;
  }
};
