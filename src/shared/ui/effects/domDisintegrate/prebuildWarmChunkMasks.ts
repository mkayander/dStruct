import { assignParticleReleaseTimes } from "#/shared/ui/effects/domDisintegrate/assignParticleReleaseTimes";
import { buildChunkMaskSequenceAsync } from "#/shared/ui/effects/domDisintegrate/buildChunkMaskSequenceAsync";
import type { ChunkMaskSequence } from "#/shared/ui/effects/domDisintegrate/createChunkMaskSequence";
import {
  cloneDisintegrateParticles,
  type DisintegrateCaptureSnapshot,
} from "#/shared/ui/effects/domDisintegrate/disintegrateCaptureSnapshot";
import {
  getParticleCanvasPadding,
  getParticleRevealMargin,
} from "#/shared/ui/effects/domDisintegrate/getParticleCanvasPadding";
import type {
  DisintegrateMaskStrategy,
  ResolvedDomDisintegrateOptions,
} from "#/shared/ui/effects/domDisintegrate/types";

const WARM_CHUNK_MASK_STRATEGY: DisintegrateMaskStrategy = "centerOut";

export const canReuseWarmChunkMasks = (
  snapshot: DisintegrateCaptureSnapshot,
  maskMode: ResolvedDomDisintegrateOptions["maskMode"],
  effectiveMaskStrategy: DisintegrateMaskStrategy,
): boolean =>
  maskMode === "chunks" &&
  snapshot.chunkMaskSequence !== undefined &&
  snapshot.chunkMaskSequence !== null &&
  snapshot.warmMaskStrategy === effectiveMaskStrategy &&
  effectiveMaskStrategy !== "wave";

/** Assigns release times and builds chunk masks during idle warm-up. */
export const prebuildWarmChunkMasks = async (
  snapshot: DisintegrateCaptureSnapshot,
  resolvedOptions: ResolvedDomDisintegrateOptions,
): Promise<DisintegrateCaptureSnapshot> => {
  if (resolvedOptions.maskMode !== "chunks") {
    return snapshot;
  }

  const particles = cloneDisintegrateParticles(snapshot.particles);
  assignParticleReleaseTimes(particles, {
    strategy: WARM_CHUNK_MASK_STRATEGY,
    displayWidth: snapshot.displayWidth,
    displayHeight: snapshot.displayHeight,
    particleStep: resolvedOptions.particleStep,
    maskSpreadDuration: resolvedOptions.maskSpreadDuration,
    waveOrigin: null,
    waveSpeed: resolvedOptions.waveSpeed,
  });

  const particlePadding = getParticleCanvasPadding(resolvedOptions);
  const particleRevealMargin = getParticleRevealMargin(resolvedOptions);
  const chunkMaskSequence = await buildChunkMaskSequenceAsync(
    {
      particles,
      displayWidth: snapshot.displayWidth,
      displayHeight: snapshot.displayHeight,
      particlePadding,
      particleRevealMargin,
      chunkSize: resolvedOptions.particleStep,
      maxSteps: resolvedOptions.maxChunkMaskSteps,
    },
    resolvedOptions.useChunkMaskWorker,
  );

  if (!chunkMaskSequence) {
    return {
      ...snapshot,
      particles,
      warmMaskStrategy: WARM_CHUNK_MASK_STRATEGY,
    };
  }

  return {
    ...snapshot,
    particles,
    chunkMaskSequence,
    warmMaskStrategy: WARM_CHUNK_MASK_STRATEGY,
  };
};

export const revokeWarmChunkMasks = (
  snapshot: DisintegrateCaptureSnapshot | null | undefined,
): void => {
  snapshot?.chunkMaskSequence?.revoke();
};

export type { ChunkMaskSequence };
