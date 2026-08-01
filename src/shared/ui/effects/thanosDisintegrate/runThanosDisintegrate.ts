import { prefersReducedMotion } from "#/shared/lib/prefersReducedMotion";
import { applyWaveOrigin } from "#/shared/ui/effects/thanosDisintegrate/applyWaveOrigin";
import { buildThanosCapture } from "#/shared/ui/effects/thanosDisintegrate/buildThanosCapture";
import { THANOS_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/thanosDisintegrate/constants";
import { drawDisintegrationFrame } from "#/shared/ui/effects/thanosDisintegrate/drawDisintegrationFrame";
import {
  prepareElementForDisintegrate,
  subscribeToViewportChanges,
  syncFixedOverlayToElement,
} from "#/shared/ui/effects/thanosDisintegrate/overlayPosition";
import { resolveRelativeOrigin } from "#/shared/ui/effects/thanosDisintegrate/resolveRelativeOrigin";
import { stepParticles } from "#/shared/ui/effects/thanosDisintegrate/stepParticles";
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

/**
 * Plays a Thanos-style particle disintegration on a DOM surface, then resolves.
 * No-ops when reduced motion is preferred or capture fails.
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

  const { displayWidth, displayHeight, sourceCanvas } = snapshot;

  const relativeOrigin = resolveRelativeOrigin(element, options?.origin);
  const maxReleaseTime = relativeOrigin
    ? applyWaveOrigin(particles, relativeOrigin, resolvedOptions.waveSpeed)
    : 0;
  const totalDurationSeconds = maxReleaseTime + resolvedOptions.maxDuration;

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
        drawDisintegrationFrame(
          overlayContext,
          particles,
          elapsedSeconds,
          sourceCanvas,
          displayWidth,
          displayHeight,
          {
            particleStep: resolvedOptions.particleStep,
            snapshotBlur: resolvedOptions.snapshotBlur,
          },
        );
        const visibleCount = stepParticles(
          particles,
          deltaSeconds,
          elapsedSeconds,
          resolvedOptions,
        );

        if (visibleCount === 0 || elapsedSeconds >= totalDurationSeconds) {
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
