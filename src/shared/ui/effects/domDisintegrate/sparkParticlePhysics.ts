import type { DisintegrateParticleMotionMode } from "#/shared/ui/effects/domDisintegrate/types";

export const SPARK_FLUTTER_STRENGTH = 210;
export const SPARK_BUOYANCY = -260;
export const SPARK_BUOYANCY_DECAY = 5.2;
export const SPARK_GRAVITY_RAMP_SECONDS = 0.18;
export const SPARK_WIND_MULTIPLIER = 0.55;
export const SPARK_UPWARD_TRAVEL_FACTOR = 0.75;
export const SPARK_TRAVEL_PADDING = 36;

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
    dragMin: 0.978,
    dragRange: 0.015,
    rotationSpeed: 9,
    fadeStartMin: 0.22,
    fadeStartRange: 0.18,
    fadeDurationMin: 0.22,
    fadeDurationRange: 0.24,
  },
};

export const getParticleMotionProfile = (
  motionMode: DisintegrateParticleMotionMode,
): ParticleMotionProfile => PARTICLE_MOTION_PROFILES[motionMode];
