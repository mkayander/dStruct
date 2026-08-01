import { prefersReducedMotion } from "#/shared/lib/prefersReducedMotion";
import {
  assignParticleReleaseTimes,
  resolveEffectiveMaskStrategy,
} from "#/shared/ui/effects/thanosDisintegrate/assignParticleReleaseTimes";
import { buildChunkMaskSequenceAsync } from "#/shared/ui/effects/thanosDisintegrate/buildChunkMaskSequenceAsync";
import { buildThanosCapture } from "#/shared/ui/effects/thanosDisintegrate/buildThanosCapture";
import type { ChunkMaskSequence } from "#/shared/ui/effects/thanosDisintegrate/createChunkMaskSequence";
import { drawDisintegrationFrame } from "#/shared/ui/effects/thanosDisintegrate/drawDisintegrationFrame";
import {
  getParticleCanvasPadding,
  getParticleRevealMargin,
} from "#/shared/ui/effects/thanosDisintegrate/getParticleCanvasPadding";
import { getWaveDisintegrationProgress } from "#/shared/ui/effects/thanosDisintegrate/getWaveDisintegrationProgress";
import {
  prepareElementForDisintegrate,
  subscribeToViewportChanges,
  syncFixedOverlayToElement,
} from "#/shared/ui/effects/thanosDisintegrate/overlayPosition";
import { resolveRelativeOrigin } from "#/shared/ui/effects/thanosDisintegrate/resolveRelativeOrigin";
import { resolveThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/resolveThanosDisintegrateOptions";
import { stepParticles } from "#/shared/ui/effects/thanosDisintegrate/stepParticles";
import {
  applyChunkMaskFrame,
  clearChunkMaskFromCanvas,
  clearChunkMaskFromElement,
} from "#/shared/ui/effects/thanosDisintegrate/syncChunkMaskSequence";
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
import type {
  ResolvedThanosDisintegrateOptions,
  ThanosDisintegrateOptions,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";

const MAX_DELTA_SECONDS = 0.05;

export type RunThanosDisintegrateOptions = ThanosDisintegrateOptions & {
  /** Pre-built capture from idle warm-up; avoids blocking SnapDOM on dismiss. */
  captureSnapshot?: ThanosCaptureSnapshot | null;
};

const syncDualLayerWave = (
  element: HTMLElement,
  particleCanvas: HTMLCanvasElement,
  particles: ThanosParticle[],
  elapsedSeconds: number,
  relativeOrigin: { x: number; y: number } | null,
  displayWidth: number,
  displayHeight: number,
  resolvedOptions: ResolvedThanosDisintegrateOptions,
  particlePadding: number,
  chunkMaskSequence: ChunkMaskSequence | null,
): void => {
  if (resolvedOptions.maskMode === "chunks" && chunkMaskSequence) {
    applyChunkMaskFrame(
      element,
      particleCanvas,
      chunkMaskSequence,
      elapsedSeconds,
    );
    return;
  }

  if (relativeOrigin) {
    applyWaveMaskToElement(
      element,
      relativeOrigin,
      elapsedSeconds,
      resolvedOptions.waveSpeed,
      displayWidth,
      displayHeight,
    );
    const canvasWidth = displayWidth + particlePadding * 2;
    const canvasHeight = displayHeight + particlePadding * 2;
    applyParticleWaveMaskToCanvas(
      particleCanvas,
      relativeOrigin,
      elapsedSeconds,
      resolvedOptions.waveSpeed,
      canvasWidth,
      canvasHeight,
      particlePadding,
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
  const resolvedOptions = resolveThanosDisintegrateOptions(disintegrateOptions);
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
  const effectiveMaskStrategy = resolveEffectiveMaskStrategy(
    disintegrateOptions?.maskStrategy,
    relativeOrigin !== null,
  );
  const maxReleaseTime = assignParticleReleaseTimes(particles, {
    strategy: effectiveMaskStrategy,
    displayWidth,
    displayHeight,
    particleStep: resolvedOptions.particleStep,
    maskSpreadDuration: resolvedOptions.maskSpreadDuration,
    waveOrigin: relativeOrigin,
    waveSpeed: resolvedOptions.waveSpeed,
  });
  const totalDurationSeconds = maxReleaseTime + resolvedOptions.maxDuration;
  const particlePadding = getParticleCanvasPadding(resolvedOptions);
  const particleRevealMargin = getParticleRevealMargin(resolvedOptions);

  const chunkMaskRef: { sequence: ChunkMaskSequence | null } = {
    sequence: null,
  };
  let isAnimationActive = true;

  if (resolvedOptions.maskMode === "chunks") {
    void buildChunkMaskSequenceAsync(
      {
        particles,
        displayWidth,
        displayHeight,
        particlePadding,
        particleRevealMargin,
        chunkSize: resolvedOptions.particleStep,
        maxSteps: resolvedOptions.maxChunkMaskSteps,
      },
      resolvedOptions.useChunkMaskWorker,
    ).then((sequence) => {
      if (!sequence) {
        return;
      }

      if (!isAnimationActive) {
        sequence.revoke();
        return;
      }

      chunkMaskRef.sequence = sequence;
    });
  }

  const canvasWidth = displayWidth + particlePadding * 2;
  const canvasHeight = displayHeight + particlePadding * 2;
  const particleZIndex = Math.max(1, resolvedOptions.zIndex - 5);
  const spriteSourceCanvas =
    resolvedOptions.particleRenderMode === "sprite" ? sourceCanvas : null;

  const overlayCanvas = document.createElement("canvas");
  overlayCanvas.width = canvasWidth;
  overlayCanvas.height = canvasHeight;
  overlayCanvas.style.position = "fixed";
  overlayCanvas.style.pointerEvents = "none";
  overlayCanvas.style.zIndex = String(particleZIndex);

  const overlayContext = overlayCanvas.getContext("2d");
  if (!overlayContext) {
    isAnimationActive = false;
    chunkMaskRef.sequence?.revoke();
    return;
  }

  const restoreElement = prepareElementForDisintegrate(element);
  syncFixedOverlayToElement(overlayCanvas, element, particlePadding);
  document.body.appendChild(overlayCanvas);

  const syncOverlayPosition = () => {
    syncFixedOverlayToElement(overlayCanvas, element, particlePadding);
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
          particlePadding,
          chunkMaskRef.sequence,
        );
        drawDisintegrationFrame(
          overlayContext,
          particles,
          elapsedSeconds,
          canvasWidth,
          canvasHeight,
          particlePadding,
          {
            renderMode: resolvedOptions.particleRenderMode,
            sourceCanvas: spriteSourceCanvas,
          },
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
          if (chunkMaskRef.sequence) {
            clearChunkMaskFromElement(element);
            clearChunkMaskFromCanvas(overlayCanvas);
          } else {
            clearWaveMaskFromElement(element);
            clearParticleWaveMaskFromCanvas(overlayCanvas);
          }
          resolve();
          return;
        }

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    });
  } finally {
    isAnimationActive = false;
    chunkMaskRef.sequence?.revoke();
    chunkMaskRef.sequence = null;
    restoreElement({ restoreOpacity: !completedSuccessfully });
    unsubscribeViewportChanges();
    overlayCanvas.remove();
  }
};
