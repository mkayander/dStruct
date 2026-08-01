import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

type DrawFrameOptions = {
  particleStep: number;
};

const drawReleasedParticles = (
  context: CanvasRenderingContext2D,
  particles: ThanosParticle[],
  frame: number,
): void => {
  for (const particle of particles) {
    if (frame < particle.releaseFrame || particle.alpha <= 0) {
      continue;
    }

    context.globalAlpha = particle.alpha;
    context.fillStyle = particle.color;
    context.fillRect(particle.x, particle.y, particle.size, particle.size);
  }

  context.globalAlpha = 1;
};

const drawUnreleasedFallbackParticles = (
  context: CanvasRenderingContext2D,
  particles: ThanosParticle[],
  frame: number,
): void => {
  for (const particle of particles) {
    if (frame < particle.releaseFrame) {
      context.globalAlpha = particle.baseAlpha;
      context.fillStyle = particle.color;
      context.fillRect(
        particle.originX,
        particle.originY,
        particle.size,
        particle.size,
      );
    }
  }

  context.globalAlpha = 1;
};

const punchReleasedHolesInSnapshot = (
  context: CanvasRenderingContext2D,
  particles: ThanosParticle[],
  frame: number,
  particleStep: number,
): void => {
  for (const particle of particles) {
    if (frame < particle.releaseFrame) {
      continue;
    }

    context.clearRect(
      particle.originX,
      particle.originY,
      particleStep,
      particleStep,
    );
  }
};

/** Draws one animation frame: remaining snapshot or static pixels, then flying particles. */
export const drawDisintegrationFrame = (
  context: CanvasRenderingContext2D,
  particles: ThanosParticle[],
  frame: number,
  sourceCanvas: HTMLCanvasElement | null,
  displayWidth: number,
  displayHeight: number,
  options: DrawFrameOptions,
): void => {
  context.clearRect(0, 0, displayWidth, displayHeight);

  if (sourceCanvas) {
    context.drawImage(sourceCanvas, 0, 0, displayWidth, displayHeight);
    punchReleasedHolesInSnapshot(
      context,
      particles,
      frame,
      options.particleStep,
    );
  } else {
    drawUnreleasedFallbackParticles(context, particles, frame);
  }

  drawReleasedParticles(context, particles, frame);
};
