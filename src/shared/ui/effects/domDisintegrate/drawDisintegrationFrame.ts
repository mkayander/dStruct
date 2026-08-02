import type { DisintegrateParticleRenderMode } from "#/shared/ui/effects/domDisintegrate/types";
import type { DisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/types";

export type DrawDisintegrationFrameOptions = {
  renderMode?: DisintegrateParticleRenderMode;
  sourceCanvas?: HTMLCanvasElement | null;
};

export type DrawDisintegrationFrameState = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  initialized: boolean;
};

const DIRTY_REGION_PAD_PX = 2;

const getParticleDrawRadius = (particle: DisintegrateParticle): number =>
  particle.size * 0.75;

/** Draws flying particles on the canvas layer beneath the live masked surface. */
export const drawDisintegrationFrame = (
  context: CanvasRenderingContext2D,
  particles: DisintegrateParticle[],
  elapsedSeconds: number,
  canvasWidth: number,
  canvasHeight: number,
  originOffset = 0,
  options?: DrawDisintegrationFrameOptions,
  drawState?: DrawDisintegrationFrameState,
): void => {
  const renderMode = options?.renderMode ?? "color";
  const sourceCanvas = options?.sourceCanvas ?? null;
  const useSprites = renderMode === "sprite" && sourceCanvas !== null;

  let boundsLeft = canvasWidth;
  let boundsTop = canvasHeight;
  let boundsRight = 0;
  let boundsBottom = 0;
  let hasVisible = false;

  for (const particle of particles) {
    if (elapsedSeconds < particle.releaseTime || particle.alpha <= 0) {
      continue;
    }

    hasVisible = true;
    const radius = getParticleDrawRadius(particle);
    const centerX = particle.x + originOffset + particle.size / 2;
    const centerY = particle.y + originOffset + particle.size / 2;
    boundsLeft = Math.min(boundsLeft, centerX - radius);
    boundsTop = Math.min(boundsTop, centerY - radius);
    boundsRight = Math.max(boundsRight, centerX + radius);
    boundsBottom = Math.max(boundsBottom, centerY + radius);
  }

  if (!hasVisible) {
    if (drawState?.initialized) {
      context.clearRect(
        drawState.left,
        drawState.top,
        drawState.right - drawState.left,
        drawState.bottom - drawState.top,
      );
      drawState.initialized = false;
    }
    return;
  }

  let clearLeft = boundsLeft;
  let clearTop = boundsTop;
  let clearRight = boundsRight;
  let clearBottom = boundsBottom;

  if (drawState?.initialized) {
    clearLeft = Math.min(clearLeft, drawState.left);
    clearTop = Math.min(clearTop, drawState.top);
    clearRight = Math.max(clearRight, drawState.right);
    clearBottom = Math.max(clearBottom, drawState.bottom);
  }

  clearLeft = Math.max(0, Math.floor(clearLeft - DIRTY_REGION_PAD_PX));
  clearTop = Math.max(0, Math.floor(clearTop - DIRTY_REGION_PAD_PX));
  clearRight = Math.min(
    canvasWidth,
    Math.ceil(clearRight + DIRTY_REGION_PAD_PX),
  );
  clearBottom = Math.min(
    canvasHeight,
    Math.ceil(clearBottom + DIRTY_REGION_PAD_PX),
  );

  context.clearRect(
    clearLeft,
    clearTop,
    clearRight - clearLeft,
    clearBottom - clearTop,
  );

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

  if (drawState) {
    drawState.left = boundsLeft;
    drawState.top = boundsTop;
    drawState.right = boundsRight;
    drawState.bottom = boundsBottom;
    drawState.initialized = true;
  }
};
