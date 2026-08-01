import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

type DrawFrameOptions = {
  particleStep: number;
  snapshotBlur: number;
};

const drawReleasedParticles = (
  context: CanvasRenderingContext2D,
  particles: ThanosParticle[],
  elapsedSeconds: number,
): void => {
  for (const particle of particles) {
    if (elapsedSeconds < particle.releaseTime || particle.alpha <= 0) {
      continue;
    }

    context.globalAlpha = particle.alpha;
    context.fillStyle = particle.color;
    context.save();
    context.translate(
      particle.x + particle.size / 2,
      particle.y + particle.size / 2,
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

const drawUnreleasedFallbackParticles = (
  context: CanvasRenderingContext2D,
  particles: ThanosParticle[],
  elapsedSeconds: number,
): void => {
  for (const particle of particles) {
    if (elapsedSeconds < particle.releaseTime) {
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
  elapsedSeconds: number,
  particleStep: number,
): void => {
  for (const particle of particles) {
    if (elapsedSeconds < particle.releaseTime) {
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
  elapsedSeconds: number,
  sourceCanvas: HTMLCanvasElement | null,
  displayWidth: number,
  displayHeight: number,
  options: DrawFrameOptions,
): void => {
  context.clearRect(0, 0, displayWidth, displayHeight);

  if (sourceCanvas) {
    if (options.snapshotBlur > 0) {
      context.filter = `blur(${options.snapshotBlur}px)`;
    }

    context.drawImage(sourceCanvas, 0, 0, displayWidth, displayHeight);
    context.filter = "none";
    punchReleasedHolesInSnapshot(
      context,
      particles,
      elapsedSeconds,
      options.particleStep,
    );
  } else {
    drawUnreleasedFallbackParticles(context, particles, elapsedSeconds);
  }

  drawReleasedParticles(context, particles, elapsedSeconds);
};
