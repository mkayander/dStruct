import { prefersReducedMotion } from "#/shared/lib/prefersReducedMotion";
import { createActiveParticleTracker } from "#/shared/ui/effects/domDisintegrate/activeParticles";
import {
  assignParticleReleaseTimes,
  resolveEffectiveMaskStrategy,
} from "#/shared/ui/effects/domDisintegrate/assignParticleReleaseTimes";
import { buildChunkMaskSequenceAsync } from "#/shared/ui/effects/domDisintegrate/buildChunkMaskSequenceAsync";
import { buildDisintegrateCapture } from "#/shared/ui/effects/domDisintegrate/buildDisintegrateCapture";
import type { ChunkMaskSequence } from "#/shared/ui/effects/domDisintegrate/createChunkMaskSequence";
import {
  cloneDisintegrateParticles,
  type DisintegrateCaptureSnapshot,
  isDisintegrateCaptureSnapshotValid,
} from "#/shared/ui/effects/domDisintegrate/disintegrateCaptureSnapshot";
import { DomDisintegrateError } from "#/shared/ui/effects/domDisintegrate/domDisintegrateError";
import { drawDisintegrationFrame } from "#/shared/ui/effects/domDisintegrate/drawDisintegrationFrame";
import type { DrawDisintegrationFrameState } from "#/shared/ui/effects/domDisintegrate/drawDisintegrationFrame";
import {
  getParticleCanvasPadding,
  getParticleRevealMargin,
} from "#/shared/ui/effects/domDisintegrate/getParticleCanvasPadding";
import { getWaveDisintegrationProgress } from "#/shared/ui/effects/domDisintegrate/getWaveDisintegrationProgress";
import {
  prepareElementForDisintegrate,
  subscribeToViewportChanges,
  syncFixedOverlayToElement,
} from "#/shared/ui/effects/domDisintegrate/overlayPosition";
import { canReuseWarmChunkMasks } from "#/shared/ui/effects/domDisintegrate/prebuildWarmChunkMasks";
import { resolveDomDisintegrateOptions } from "#/shared/ui/effects/domDisintegrate/resolveDomDisintegrateOptions";
import { resolveRelativeOrigin } from "#/shared/ui/effects/domDisintegrate/resolveRelativeOrigin";
import { stepParticles } from "#/shared/ui/effects/domDisintegrate/stepParticles";
import {
  applyChunkMaskFrame,
  clearChunkMaskFromCanvas,
  clearChunkMaskFromElement,
} from "#/shared/ui/effects/domDisintegrate/syncChunkMaskSequence";
import {
  applyParticleWaveMaskToCanvas,
  applyWaveMaskToElement,
  clearParticleWaveMaskFromCanvas,
  clearWaveMaskFromElement,
} from "#/shared/ui/effects/domDisintegrate/syncElementWaveMask";
import type {
  DisintegrateParticle,
  DomDisintegrateOptions,
  ResolvedDomDisintegrateOptions,
} from "#/shared/ui/effects/domDisintegrate/types";

const MAX_DELTA_SECONDS = 0.05;

export type RunDomDisintegrateOptions = DomDisintegrateOptions & {
  /** Pre-built capture from idle warm-up; avoids blocking SnapDOM on dismiss. */
  captureSnapshot?: DisintegrateCaptureSnapshot | null;
};

const applyOpacityCrossfade = (
  element: HTMLElement,
  particleCanvas: HTMLCanvasElement,
  particles: DisintegrateParticle[],
  elapsedSeconds: number,
): void => {
  const disintegrationProgress = getWaveDisintegrationProgress(
    particles,
    elapsedSeconds,
  );
  const remainingOpacity = Math.max(0, 1 - disintegrationProgress);
  element.style.opacity = String(remainingOpacity);
  particleCanvas.style.opacity = String(disintegrationProgress);
};

const applyRadialWave = (
  element: HTMLElement,
  particleCanvas: HTMLCanvasElement,
  relativeOrigin: { x: number; y: number },
  elapsedSeconds: number,
  waveSpeed: number,
  displayWidth: number,
  displayHeight: number,
  particlePadding: number,
): void => {
  applyWaveMaskToElement(
    element,
    relativeOrigin,
    elapsedSeconds,
    waveSpeed,
    displayWidth,
    displayHeight,
  );
  const canvasWidth = displayWidth + particlePadding * 2;
  const canvasHeight = displayHeight + particlePadding * 2;
  applyParticleWaveMaskToCanvas(
    particleCanvas,
    relativeOrigin,
    elapsedSeconds,
    waveSpeed,
    canvasWidth,
    canvasHeight,
    particlePadding,
  );
};

type DualLayerMaskState = {
  chunkMaskSequence: ChunkMaskSequence | null;
  /** Sticky once radial masks were shown while chunk masks were still building. */
  startedRadialFallback: boolean;
};

const syncDualLayerWave = (
  element: HTMLElement,
  particleCanvas: HTMLCanvasElement,
  particles: DisintegrateParticle[],
  elapsedSeconds: number,
  relativeOrigin: { x: number; y: number } | null,
  displayWidth: number,
  displayHeight: number,
  resolvedOptions: ResolvedDomDisintegrateOptions,
  particlePadding: number,
  maskState: DualLayerMaskState,
): void => {
  const { chunkMaskSequence, startedRadialFallback } = maskState;

  if (
    resolvedOptions.maskMode === "chunks" &&
    chunkMaskSequence &&
    !startedRadialFallback
  ) {
    applyChunkMaskFrame(
      element,
      particleCanvas,
      chunkMaskSequence,
      elapsedSeconds,
    );
    return;
  }

  if (relativeOrigin) {
    if (resolvedOptions.maskMode === "chunks" && !chunkMaskSequence) {
      maskState.startedRadialFallback = true;
    }

    applyRadialWave(
      element,
      particleCanvas,
      relativeOrigin,
      elapsedSeconds,
      resolvedOptions.waveSpeed,
      displayWidth,
      displayHeight,
      particlePadding,
    );
    return;
  }

  applyOpacityCrossfade(element, particleCanvas, particles, elapsedSeconds);
};

const clearActiveMasks = (
  element: HTMLElement,
  particleCanvas: HTMLCanvasElement,
  maskState: DualLayerMaskState,
): void => {
  if (maskState.chunkMaskSequence && !maskState.startedRadialFallback) {
    clearChunkMaskFromElement(element);
    clearChunkMaskFromCanvas(particleCanvas);
    return;
  }

  clearWaveMaskFromElement(element);
  clearParticleWaveMaskFromCanvas(particleCanvas);
};

/**
 * Plays a particle disintegration on a DOM surface, then resolves.
 * The live element stays visible with a synced radial mask; particles fly underneath.
 */
export const runDomDisintegrate = async (
  element: HTMLElement,
  options?: RunDomDisintegrateOptions,
): Promise<void> => {
  if (prefersReducedMotion()) {
    return;
  }

  const { captureSnapshot, ...disintegrateOptions } = options ?? {};
  const resolvedOptions = resolveDomDisintegrateOptions(
    disintegrateOptions,
    element,
  );
  const initialRect = element.getBoundingClientRect();
  if (initialRect.width <= 0 || initialRect.height <= 0) {
    throw new DomDisintegrateError(
      "zero_size_surface",
      "Cannot disintegrate an element with zero width or height.",
    );
  }

  const snapshot =
    captureSnapshot &&
    isDisintegrateCaptureSnapshotValid(captureSnapshot, element)
      ? captureSnapshot
      : await buildDisintegrateCapture(element, {
          mode: "fast",
          disintegrateOptions: resolvedOptions,
        });

  const { displayWidth, displayHeight, sourceCanvas } = snapshot;
  const relativeOrigin = resolveRelativeOrigin(element, options?.origin);
  const effectiveMaskStrategy = resolveEffectiveMaskStrategy(
    disintegrateOptions?.maskStrategy,
    relativeOrigin !== null,
  );
  const reuseWarmChunkMasks = canReuseWarmChunkMasks(
    snapshot,
    resolvedOptions.maskMode,
    effectiveMaskStrategy,
  );

  const particles = cloneDisintegrateParticles(snapshot.particles);

  if (particles.length === 0) {
    throw new DomDisintegrateError(
      "no_particles",
      "Cannot disintegrate a surface with no sample particles.",
    );
  }

  let maxReleaseTime = 0;
  if (!reuseWarmChunkMasks) {
    maxReleaseTime = assignParticleReleaseTimes(particles, {
      strategy: effectiveMaskStrategy,
      displayWidth,
      displayHeight,
      particleStep: resolvedOptions.particleStep,
      maskSpreadDuration: resolvedOptions.maskSpreadDuration,
      waveOrigin: relativeOrigin,
      waveSpeed: resolvedOptions.waveSpeed,
    });
  } else {
    for (const particle of particles) {
      maxReleaseTime = Math.max(maxReleaseTime, particle.releaseTime);
    }
  }
  const totalDurationSeconds = maxReleaseTime + resolvedOptions.maxDuration;
  const particlePadding = getParticleCanvasPadding(resolvedOptions);
  const particleRevealMargin = getParticleRevealMargin(resolvedOptions);

  const maskState: DualLayerMaskState = {
    chunkMaskSequence: reuseWarmChunkMasks
      ? (snapshot.chunkMaskSequence ?? null)
      : null,
    startedRadialFallback: false,
  };
  let isAnimationActive = true;
  let ownsChunkMaskSequence = !reuseWarmChunkMasks;

  if (resolvedOptions.maskMode === "chunks" && !reuseWarmChunkMasks) {
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

      // Drop unused sequences immediately so large PNG data-URL arrays do not linger.
      if (!isAnimationActive || maskState.startedRadialFallback) {
        sequence.revoke();
        return;
      }

      maskState.chunkMaskSequence = sequence;
      ownsChunkMaskSequence = true;
    });
  }

  const particleTracker = createActiveParticleTracker(particles);

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
    maskState.chunkMaskSequence?.revoke();
    throw new DomDisintegrateError(
      "canvas_unavailable",
      "2D canvas context is unavailable for the particle overlay.",
    );
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
  const drawState: DrawDisintegrationFrameState = {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    initialized: false,
  };

  try {
    await new Promise<void>((resolve, reject) => {
      let startTime: number | null = null;
      let lastTime: number | null = null;

      const animate = (timestamp: number) => {
        try {
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
            maskState,
          );
          particleTracker.syncReleased(elapsedSeconds);
          const activeParticles = particleTracker.getActive();
          drawDisintegrationFrame(
            overlayContext,
            activeParticles,
            elapsedSeconds,
            canvasWidth,
            canvasHeight,
            particlePadding,
            {
              renderMode: resolvedOptions.particleRenderMode,
              sourceCanvas: spriteSourceCanvas,
            },
            drawState,
          );
          stepParticles(
            activeParticles,
            deltaSeconds,
            elapsedSeconds,
            resolvedOptions,
          );
          particleTracker.removeDead();
          const visibleCount = particleTracker.getVisibleCount();

          if (visibleCount === 0 || elapsedSeconds >= totalDurationSeconds) {
            completedSuccessfully = true;
            element.style.opacity = "0";
            clearActiveMasks(element, overlayCanvas, maskState);
            resolve();
            return;
          }

          requestAnimationFrame(animate);
        } catch (error) {
          reject(error);
        }
      };

      requestAnimationFrame(animate);
    });
  } finally {
    isAnimationActive = false;
    if (ownsChunkMaskSequence) {
      maskState.chunkMaskSequence?.revoke();
    }
    maskState.chunkMaskSequence = null;
    restoreElement({ restoreOpacity: !completedSuccessfully });
    unsubscribeViewportChanges();
    overlayCanvas.remove();
  }
};
