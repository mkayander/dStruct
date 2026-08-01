import type { ThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/types";

export const THANOS_DISINTEGRATE_DEFAULTS = {
  particleStep: 3,
  particleSize: 2,
  maxVelocity: 165,
  windX: 20,
  windY: -14,
  gravity: 180,
  maxDuration: 1.0,
  zIndex: 9999,
  waveSpeed: 700,
  snapshotBlur: 0,
} as const satisfies Required<Omit<ThanosDisintegrateOptions, "origin">>;
