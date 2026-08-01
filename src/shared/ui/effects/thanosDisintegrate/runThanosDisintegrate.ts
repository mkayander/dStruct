import { prefersReducedMotion } from "#/shared/lib/prefersReducedMotion";
import { applyWaveOrigin } from "#/shared/ui/effects/thanosDisintegrate/applyWaveOrigin";
import { captureElementToCanvas } from "#/shared/ui/effects/thanosDisintegrate/captureElementToCanvas";
import { THANOS_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/thanosDisintegrate/constants";
import { createFallbackParticlesFromElement } from "#/shared/ui/effects/thanosDisintegrate/createFallbackParticlesFromElement";
import { createParticlesFromImageData } from "#/shared/ui/effects/thanosDisintegrate/createParticlesFromImageData";
import { drawDisintegrationFrame } from "#/shared/ui/effects/thanosDisintegrate/drawDisintegrationFrame";
import {
  prepareElementForDisintegrate,
  subscribeToViewportChanges,
  syncFixedOverlayToElement,
} from "#/shared/ui/effects/thanosDisintegrate/overlayPosition";
import { resolveRelativeOrigin } from "#/shared/ui/effects/thanosDisintegrate/resolveRelativeOrigin";
import { scaleParticleCoordinates } from "#/shared/ui/effects/thanosDisintegrate/scaleParticleCoordinates";
import type {
  ThanosDisintegrateOptions,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";

type ResolvedThanosOptions = Required<
  Omit<ThanosDisintegrateOptions, "origin">
>;

const resolveOptions = (
  options?: ThanosDisintegrateOptions,
): ResolvedThanosOptions => ({
  ...THANOS_DISINTEGRATE_DEFAULTS,
  ...options,
});

const stepParticles = (
  particles: ThanosParticle[],
  frame: number,
  options: ResolvedThanosOptions,
): number => {
  let visibleCount = 0;

  for (const particle of particles) {
    if (frame < particle.releaseFrame) {
      visibleCount += 1;
      continue;
    }

    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += options.gravity;
    particle.vx += options.windX * 0.02;
    particle.vy += options.windY * 0.02;
    particle.alpha -= particle.decay;

    if (particle.alpha > 0) {
      visibleCount += 1;
    }
  }

  return visibleCount;
};

/**
 * Plays a Thanos-style particle disintegration on a DOM surface, then resolves.
 * No-ops when reduced motion is preferred or capture fails.
 */
export const runThanosDisintegrate = async (
  element: HTMLElement,
  options?: ThanosDisintegrateOptions,
): Promise<void> => {
  if (prefersReducedMotion()) {
    return;
  }

  const resolvedOptions = resolveOptions(options);
  const initialRect = element.getBoundingClientRect();
  if (initialRect.width <= 0 || initialRect.height <= 0) {
    return;
  }

  let sourceCanvas: HTMLCanvasElement | null = null;
  let hasReadableCapture = false;
  try {
    sourceCanvas = await captureElementToCanvas(element);
  } catch {
    sourceCanvas = null;
  }

  const rect = element.getBoundingClientRect();
  const displayWidth = Math.max(1, Math.round(rect.width));
  const displayHeight = Math.max(1, Math.round(rect.height));
  const captureWidth = Math.max(1, sourceCanvas?.width ?? displayWidth);
  const captureHeight = Math.max(1, sourceCanvas?.height ?? displayHeight);

  let particles: ThanosParticle[] = [];

  if (sourceCanvas) {
    const context = sourceCanvas.getContext("2d", { willReadFrequently: true });
    if (context) {
      try {
        const imageData = context.getImageData(
          0,
          0,
          captureWidth,
          captureHeight,
        );
        particles = createParticlesFromImageData(imageData, resolvedOptions);
        hasReadableCapture = particles.length > 0;
      } catch {
        // SVG foreignObject capture taints the canvas in some browsers.
      }
    }
  }

  if (!hasReadableCapture) {
    sourceCanvas = null;
  }

  if (particles.length === 0) {
    particles = createFallbackParticlesFromElement(element, resolvedOptions);
  }
  if (particles.length === 0) {
    return;
  }

  scaleParticleCoordinates(
    particles,
    displayWidth / captureWidth,
    displayHeight / captureHeight,
  );

  const relativeOrigin = resolveRelativeOrigin(element, options?.origin);
  const waveDelayFrames = relativeOrigin
    ? applyWaveOrigin(particles, relativeOrigin, resolvedOptions.waveSpeed)
    : 0;
  const totalMaxFrames = resolvedOptions.maxFrames + waveDelayFrames;

  const overlayCanvas = document.createElement("canvas");
  overlayCanvas.width = displayWidth;
  overlayCanvas.height = displayHeight;
  overlayCanvas.style.position = "fixed";
  overlayCanvas.style.pointerEvents = "none";
  overlayCanvas.style.zIndex = String(Math.max(resolvedOptions.zIndex, 12_000));

  const overlayContext = overlayCanvas.getContext("2d");
  if (!overlayContext) {
    return;
  }

  const restoreElement = prepareElementForDisintegrate(element);
  syncFixedOverlayToElement(overlayCanvas, element);
  document.body.appendChild(overlayCanvas);

  const syncOverlayPosition = () => {
    syncFixedOverlayToElement(overlayCanvas, element);
  };
  const unsubscribeViewportChanges = subscribeToViewportChanges(
    element,
    syncOverlayPosition,
  );

  try {
    await new Promise<void>((resolve) => {
      let frame = 0;

      const animate = () => {
        syncOverlayPosition();
        drawDisintegrationFrame(
          overlayContext,
          particles,
          frame,
          sourceCanvas,
          displayWidth,
          displayHeight,
          { particleStep: resolvedOptions.particleStep },
        );
        const visibleCount = stepParticles(particles, frame, resolvedOptions);

        frame += 1;
        if (visibleCount === 0 || frame >= totalMaxFrames) {
          element.style.opacity = "0";
          resolve();
          return;
        }

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    });
  } catch (error) {
    restoreElement();
    throw error;
  } finally {
    unsubscribeViewportChanges();
    overlayCanvas.remove();
  }
};
