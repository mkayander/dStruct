import type { DomDisintegrateOptions } from "#/shared/ui/effects/domDisintegrate/types";

export type DomDisintegrateQualityTier = "high" | "medium" | "low";

export type DomDisintegrateQualityContext = {
  displayWidth: number;
  displayHeight: number;
};

export type DomDisintegrateDeviceProfile = {
  hardwareConcurrency: number;
  deviceMemory?: number;
  prefersReducedMotion: boolean;
  coarsePointer: boolean;
};

type DomDisintegrateQualityOverrides = Pick<
  DomDisintegrateOptions,
  "particleStep" | "maxDuration" | "maxChunkMaskSteps"
>;

const TIER_BASE: Record<
  DomDisintegrateQualityTier,
  DomDisintegrateQualityOverrides
> = {
  high: { particleStep: 3, maxDuration: 1, maxChunkMaskSteps: 96 },
  medium: { particleStep: 4, maxDuration: 0.9, maxChunkMaskSteps: 64 },
  low: { particleStep: 5, maxDuration: 0.8, maxChunkMaskSteps: 48 },
};

const TIER_MAX_GRID_CELLS: Record<DomDisintegrateQualityTier, number> = {
  high: 2800,
  medium: 1800,
  low: 1100,
};

const MAX_PARTICLE_STEP = 8;

export const getDomDisintegrateDeviceProfile =
  (): DomDisintegrateDeviceProfile => {
    if (typeof navigator === "undefined") {
      return {
        hardwareConcurrency: 8,
        deviceMemory: undefined,
        prefersReducedMotion: false,
        coarsePointer: false,
      };
    }

    return {
      hardwareConcurrency: navigator.hardwareConcurrency ?? 4,
      deviceMemory: (navigator as Navigator & { deviceMemory?: number })
        .deviceMemory,
      prefersReducedMotion:
        typeof matchMedia === "function" &&
        matchMedia("(prefers-reduced-motion: reduce)").matches,
      coarsePointer:
        typeof matchMedia === "function" &&
        matchMedia("(pointer: coarse)").matches,
    };
  };

export const detectDomDisintegrateQualityTier = (
  profile: DomDisintegrateDeviceProfile = getDomDisintegrateDeviceProfile(),
): DomDisintegrateQualityTier => {
  if (profile.prefersReducedMotion) {
    return "low";
  }

  let pressureScore = 0;
  if (profile.hardwareConcurrency <= 4) {
    pressureScore += 1;
  }
  if (profile.hardwareConcurrency <= 2) {
    pressureScore += 1;
  }
  if (profile.deviceMemory !== undefined && profile.deviceMemory <= 4) {
    pressureScore += 1;
  }
  if (profile.deviceMemory !== undefined && profile.deviceMemory <= 2) {
    pressureScore += 1;
  }
  if (profile.coarsePointer) {
    pressureScore += 1;
  }

  if (pressureScore >= 3) {
    return "low";
  }
  if (pressureScore >= 1) {
    return "medium";
  }

  return "high";
};

export const estimateParticleGridCells = (
  displayWidth: number,
  displayHeight: number,
  particleStep: number,
): number => {
  const cols = Math.ceil(displayWidth / particleStep);
  const rows = Math.ceil(displayHeight / particleStep);
  return cols * rows;
};

/** Raises particle stride until the surface grid fits the tier particle budget. */
export const resolveParticleStepForSurface = (
  displayWidth: number,
  displayHeight: number,
  baseParticleStep: number,
  maxGridCells: number,
): number => {
  let particleStep = Math.max(2, baseParticleStep);

  while (
    particleStep < MAX_PARTICLE_STEP &&
    estimateParticleGridCells(displayWidth, displayHeight, particleStep) >
      maxGridCells
  ) {
    particleStep += 1;
  }

  return particleStep;
};

export const getDomDisintegrateQualityOverrides = (
  context: DomDisintegrateQualityContext,
  profile: DomDisintegrateDeviceProfile = getDomDisintegrateDeviceProfile(),
): DomDisintegrateQualityOverrides => {
  const tier = detectDomDisintegrateQualityTier(profile);
  const tierBase = TIER_BASE[tier];

  return {
    ...tierBase,
    particleStep: resolveParticleStepForSurface(
      context.displayWidth,
      context.displayHeight,
      tierBase.particleStep ?? 3,
      TIER_MAX_GRID_CELLS[tier],
    ),
  };
};
