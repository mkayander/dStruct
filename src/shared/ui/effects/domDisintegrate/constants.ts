import type { ResolvedDomDisintegrateOptions } from "#/shared/ui/effects/domDisintegrate/types";

export const DOM_DISINTEGRATE_DEFAULTS = {
  particleStep: 3,
  particleSize: 2,
  maxVelocity: 165,
  windX: 14,
  windY: -8,
  gravity: 240,
  maxDuration: 1.0,
  zIndex: 9999,
  waveSpeed: 700,
  maskMode: "chunks",
  maxChunkMaskSteps: 96,
  maskSpreadDuration: 0.6,
  particleRenderMode: "color",
  useChunkMaskWorker: true,
  particleMotionMode: "windy",
} as const satisfies ResolvedDomDisintegrateOptions;
