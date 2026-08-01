import { prefersReducedMotion } from "#/shared/lib/prefersReducedMotion";
import { applyWaveOrigin } from "#/shared/ui/effects/thanosDisintegrate/applyWaveOrigin";
import { buildThanosCapture } from "#/shared/ui/effects/thanosDisintegrate/buildThanosCapture";
import { THANOS_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/thanosDisintegrate/constants";
import { drawDisintegrationFrame } from "#/shared/ui/effects/thanosDisintegrate/drawDisintegrationFrame";
import { getWaveDisintegrationProgress } from "#/shared/ui/effects/thanosDisintegrate/getWaveDisintegrationProgress";
import {
  prepareElementForDisintegrate,
  subscribeToViewportChanges,
  syncFixedOverlayToElement,
} from "#/shared/ui/effects/thanosDisintegrate/overlayPosition";
import { resolveRelativeOrigin } from "#/shared/ui/effects/thanosDisintegrate/resolveRelativeOrigin";
import { stepParticles } from "#/shared/ui/effects/thanosDisintegrate/stepParticles";
import {
  applyParticleWaveMaskToCanvas,
  applyWaveMaskToElement,
  clearParticleWaveMaskFromCanvas,
  clearWaveMaskFromElement,
} from "#/shared/ui/effects/thanosDisintegrate/syncElementWaveMask";
import {
  cloneThanosParticles,
  isThanosCaptureSnapshotValid,
  type ThanosCaptureSnapshot,
} from "#/shared/ui/effects/thanosDisintegrate/thanosCaptureSnapshot";
import type { ThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/types";

type ResolvedThanosOptions = Required<
  Omit<ThanosDisintegrateOptions, "origin">
>;

const MAX_DELTA_SECONDS = 0.05;

const resolveOptions = (
  options?: ThanosDisintegrateOptions,
): ResolvedThanosOptions => ({
  ...THANOS_DISINTEGRATE_DEFAULTS,
  ...options,
});

export type RunThanosDisintegrateOptions = ThanosDisintegrateOptions & {
  /** Pre-built capture from idle warm-up; avoids blocking SnapDOM on dismiss. */
  captureSnapshot?: ThanosCaptureSnapshot | null;
};

const syncDualLayerWave = (
  element: HTMLElement,
  particleCanvas: HTMLCanvasElement,
  particles: ReturnType<typeof cloneThanosParticles>,
  elapsedSeconds: number,
  relativeOrigin: { x: number; y: number } | null,
  displayWidth: number,
  displayHeight: number,
  resolvedOptions: ResolvedThanosOptions,
): void => {
  if (relativeOrigin) {
    applyWaveMaskToElement(
      element,
      relativeOrigin,
      elapsedSeconds,
      resolvedOptions.waveSpeed,
      displayWidth,
      displayHeight,
    );
    applyParticleWaveMaskToCanvas(
      particleCanvas,
      relativeOrigin,
      elapsedSeconds,
      resolvedOptions.waveSpeed,
      displayWidth,
      displayHeight,
    );
    return;
  }

  const disintegrationProgress = getWaveDisintegrationProgress(
    particles,
    elapsedSeconds,
  );
  const remainingOpacity = Math.max(0, 1 - disintegrationProgress);
  element.style.opacity = String(remainingOpacity);
  particleCanvas.style.opacity = String(disintegrationProgress);
};

/**
 * Plays a Thanos-style particle disintegration on a DOM surface, then resolves.
 * The live element stays visible with a synced radial mask; particles fly underneath.
 */
export const runThanosDisintegrate = async (
  element: HTMLElement,
  options?: RunThanosDisintegrateOptions,
): Promise<void> => {
  if (prefersReducedMotion()) {
    return;
  }

  const { captureSnapshot, ...disintegrateOptions } = options ?? {};
  const resolvedOptions = resolveOptions(disintegrateOptions);
  const initialRect = element.getBoundingClientRect();
  if (initialRect.width <= 0 || initialRect.height <= 0) {
    return;
  }

  const snapshot =
    captureSnapshot && isThanosCaptureSnapshotValid(captureSnapshot, element)
      ? captureSnapshot
      : await buildThanosCapture(element, {
          mode: "fast",
          disintegrateOptions: resolvedOptions,
        });

  const particles = cloneThanosParticles(snapshot.particles);
  if (particles.length === 0) {
    return;
  }

  const { displayWidth, displayHeight } = snapshot;

  const relativeOrigin = resolveRelativeOrigin(element, options?.origin);
  const maxReleaseTime = relativeOrigin
    ? applyWaveOrigin(particles, relativeOrigin, resolvedOptions.waveSpeed)
    : 0;
  const totalDurationSeconds = maxReleaseTime + resolvedOptions.maxDuration;
  const particleZIndex = Math.max(1, resolvedOptions.zIndex - 5);

  const overlayCanvas = document.createElement("canvas");
  overlayCanvas.width = displayWidth;
  overlayCanvas.height = displayHeight;
  overlayCanvas.style.position = "fixed";
  overlayCanvas.style.pointerEvents = "none";
  overlayCanvas.style.zIndex = String(particleZIndex);

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

  let completedSuccessfully = false;

  try {
    await new Promise<void>((resolve) => {
      let startTime: number | null = null;
      let lastTime: number | null = null;

      const animate = (timestamp: number) => {
        if (startTime === null) {
          startTime = timestamp;
        }
        if (lastTime === null) {
          lastTime = timestamp;
        }

        const elapsedSeconds = (timestamp - startTime) / 1000;
        const deltaSeconds = Math.min(
          (timestamp - lastTime) / 1000,
          MAX_DELTA_SECONDS,
        );
        lastTime = timestamp;

        syncOverlayPosition();
        syncDualLayerWave(
          element,
          overlayCanvas,
          particles,
          elapsedSeconds,
          relativeOrigin,
          displayWidth,
          displayHeight,
          resolvedOptions,
        );
        drawDisintegrationFrame(
          overlayContext,
          particles,
          elapsedSeconds,
          displayWidth,
          displayHeight,
        );
        const visibleCount = stepParticles(
          particles,
          deltaSeconds,
          elapsedSeconds,
          resolvedOptions,
        );

        if (visibleCount === 0 || elapsedSeconds >= totalDurationSeconds) {
          completedSuccessfully = true;
          element.style.opacity = "0";
          clearWaveMaskFromElement(element);
          clearParticleWaveMaskFromCanvas(overlayCanvas);
          resolve();
          return;
        }

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    });
  } finally {
    restoreElement({ restoreOpacity: !completedSuccessfully });
    unsubscribeViewportChanges();
    overlayCanvas.remove();
  }
};
