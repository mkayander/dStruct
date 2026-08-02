import { hashSparkSeed01 } from "#/shared/ui/effects/domDisintegrate/sparkSeedHash";
import type {
  DisintegrateParticleMotionMode,
  ResolvedDomDisintegrateOptions,
} from "#/shared/ui/effects/domDisintegrate/types";

export const SPARK_TURBULENCE_STRENGTH = 195;
export const SPARK_TURBULENCE_MAX_LATERAL = 48;
/** Sustained upward acceleration (negative = rise on canvas Y). */
export const SPARK_LIFT_ACCEL = -158;
/** Global wind from options applied as acceleration (same for every spark). */
export const SPARK_WIND_ACCEL = 1;
/** Sparks may wobble slightly but never arc downward like thrown balls. */
export const SPARK_MAX_DOWNWARD_VELOCITY = 8;
export const SPARK_UPWARD_TRAVEL_FACTOR = 1.25;
export const SPARK_TRAVEL_PADDING = 78;

type ParticleMotionProfile = {
  dragMin: number;
  dragRange: number;
  rotationSpeed: number;
  fadeStartMin: number;
  fadeStartRange: number;
  fadeDurationMin: number;
  fadeDurationRange: number;
};

const PARTICLE_MOTION_PROFILES: Record<
  DisintegrateParticleMotionMode,
  ParticleMotionProfile
> = {
  splat: {
    dragMin: 0.955,
    dragRange: 0.03,
    rotationSpeed: 5,
    fadeStartMin: 0.45,
    fadeStartRange: 0.25,
    fadeDurationMin: 0.3,
    fadeDurationRange: 0.35,
  },
  windy: {
    dragMin: 0.966,
    dragRange: 0.02,
    rotationSpeed: 11,
    fadeStartMin: 0.38,
    fadeStartRange: 0.24,
    fadeDurationMin: 0.5,
    fadeDurationRange: 0.38,
  },
};

/** Per-particle lift variation while sharing the same global wind field. */
export const getSparkLiftFactor = (turbulenceSeed: number): number =>
  0.68 + hashSparkSeed01(turbulenceSeed * 7.31) * 0.56;

const SPARK_MAX_LIFT_FACTOR = 1.24;
const SPARK_MAX_TURBULENCE_FORCE = 1.15;

/** Conservative travel bound for windy sparks (no splat gravity term). */
export const computeWindyParticleMaxTravel = (
  resolvedOptions: ResolvedDomDisintegrateOptions,
): number => {
  const duration = resolvedOptions.maxDuration;
  const maxLaunchSpeed = resolvedOptions.maxVelocity * 1.12;
  const maxLiftAccel =
    Math.abs(SPARK_LIFT_ACCEL) * SPARK_MAX_LIFT_FACTOR +
    Math.abs(resolvedOptions.windY) * SPARK_WIND_ACCEL;
  const maxLateralAccel =
    SPARK_TURBULENCE_STRENGTH * SPARK_MAX_TURBULENCE_FORCE +
    Math.abs(resolvedOptions.windX) * SPARK_WIND_ACCEL;

  const verticalReach =
    maxLaunchSpeed * duration +
    0.5 * maxLiftAccel * duration * duration +
    resolvedOptions.maxVelocity * SPARK_UPWARD_TRAVEL_FACTOR;
  const horizontalReach =
    maxLaunchSpeed * duration +
    0.5 * maxLateralAccel * duration * duration * 0.35 +
    SPARK_TURBULENCE_MAX_LATERAL +
    SPARK_TRAVEL_PADDING;

  return (
    Math.max(verticalReach, horizontalReach) * 1.12 +
    resolvedOptions.particleSize * 2
  );
};

export type SparkDriftDirection = {
  driftX: number;
  driftY: number;
};

/**
 * Shared upwind drift for all sparks — wind from the left pushes everyone up-right.
 * Blends option wind with a mandatory upward component.
 */
export const getSparkDriftDirection = (
  windX: number,
  windY: number,
): SparkDriftDirection => {
  const windLength = Math.hypot(windX, windY);
  const windNormX = windLength > 0.01 ? windX / windLength : 0.85;
  const windNormY = windLength > 0.01 ? windY / windLength : -0.52;

  const blendedX = windNormX * 0.62;
  const blendedY = windNormY * 0.62 - 0.78;
  const length = Math.hypot(blendedX, blendedY) || 1;

  return {
    driftX: blendedX / length,
    driftY: blendedY / length,
  };
};

export const getParticleMotionProfile = (
  motionMode: DisintegrateParticleMotionMode,
): ParticleMotionProfile => PARTICLE_MOTION_PROFILES[motionMode];
