import type { DisintegrateParticleMotionMode } from "#/shared/ui/effects/domDisintegrate/types";

export const SPARK_TURBULENCE_STRENGTH = 195;
export const SPARK_TURBULENCE_MAX_LATERAL = 48;
export const SPARK_BUOYANCY = -285;
export const SPARK_BUOYANCY_DECAY = 3.1;
export const SPARK_GRAVITY_RAMP_SECONDS = 0.36;
export const SPARK_WIND_MULTIPLIER = 0.62;
export const SPARK_UPWARD_TRAVEL_FACTOR = 1.2;
export const SPARK_TRAVEL_PADDING = 72;

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
    dragMin: 0.964,
    dragRange: 0.022,
    rotationSpeed: 11,
    fadeStartMin: 0.38,
    fadeStartRange: 0.24,
    fadeDurationMin: 0.5,
    fadeDurationRange: 0.38,
  },
};

export const getParticleMotionProfile = (
  motionMode: DisintegrateParticleMotionMode,
): ParticleMotionProfile => PARTICLE_MOTION_PROFILES[motionMode];
