import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

/** Draws flying particles on the canvas layer beneath the live masked surface. */
export const drawDisintegrationFrame = (
  context: CanvasRenderingContext2D,
  particles: ThanosParticle[],
  elapsedSeconds: number,
  canvasWidth: number,
  canvasHeight: number,
  originOffset = 0,
): void => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  for (const particle of particles) {
    if (elapsedSeconds < particle.releaseTime || particle.alpha <= 0) {
      continue;
    }

    context.globalAlpha = particle.alpha;
    context.fillStyle = particle.color;
    context.save();
    context.translate(
      particle.x + originOffset + particle.size / 2,
      particle.y + originOffset + particle.size / 2,
    );
    context.rotate(particle.rotation);
    context.fillRect(
      -particle.size / 2,
      -particle.size / 2,
      particle.size,
      particle.size,
    );
    context.restore();
  }

  context.globalAlpha = 1;
};
