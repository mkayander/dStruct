import type { DisintegrateParticleRenderMode } from "#/shared/ui/effects/domDisintegrate/types";
import type { DisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/types";

export type DrawDisintegrationFrameOptions = {
  renderMode?: DisintegrateParticleRenderMode;
  sourceCanvas?: HTMLCanvasElement | null;
};

/** Draws flying particles on the canvas layer beneath the live masked surface. */
export const drawDisintegrationFrame = (
  context: CanvasRenderingContext2D,
  particles: DisintegrateParticle[],
  elapsedSeconds: number,
  canvasWidth: number,
  canvasHeight: number,
  originOffset = 0,
  options?: DrawDisintegrationFrameOptions,
): void => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  const renderMode = options?.renderMode ?? "color";
  const sourceCanvas = options?.sourceCanvas ?? null;
  const useSprites = renderMode === "sprite" && sourceCanvas !== null;

  for (const particle of particles) {
    if (elapsedSeconds < particle.releaseTime || particle.alpha <= 0) {
      continue;
    }

    context.globalAlpha = particle.alpha;
    context.save();
    context.translate(
      particle.x + originOffset + particle.size / 2,
      particle.y + originOffset + particle.size / 2,
    );
    context.rotate(particle.rotation);

    if (useSprites) {
      context.drawImage(
        sourceCanvas,
        particle.originX,
        particle.originY,
        particle.size,
        particle.size,
        -particle.size / 2,
        -particle.size / 2,
        particle.size,
        particle.size,
      );
    } else {
      context.fillStyle = particle.color;
      context.fillRect(
        -particle.size / 2,
        -particle.size / 2,
        particle.size,
        particle.size,
      );
    }

    context.restore();
  }

  context.globalAlpha = 1;
};
