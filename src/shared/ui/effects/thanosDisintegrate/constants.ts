import type { ThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/types";

export const THANOS_DISINTEGRATE_DEFAULTS = {
  particleStep: 3,
  particleSize: 2,
  maxVelocity: 2.4,
  windX: 0.35,
  windY: -0.25,
  gravity: 0.04,
  maxFrames: 90,
  zIndex: 9999,
} as const satisfies Required<ThanosDisintegrateOptions>;
