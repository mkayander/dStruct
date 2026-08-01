import type { DisintegrateParticleMotionMode } from "#/shared/ui/effects/domDisintegrate/types";

export const SPARK_FLUTTER_STRENGTH = 280;
export const SPARK_BUOYANCY = -300;
export const SPARK_BUOYANCY_DECAY = 2.5;
export const SPARK_GRAVITY_RAMP_SECONDS = 0.42;
export const SPARK_WIND_MULTIPLIER = 0.5;
export const SPARK_UPWARD_TRAVEL_FACTOR = 1.35;
export const SPARK_TRAVEL_PADDING = 84;
/** Zig-zag angular frequency (rad/s); ~5 lateral swings per second of flight. */
export const SPARK_ZIGZAG_FREQUENCY = 32;
/** Peak lateral speed while steering along the zig-zag sine path (px/s). */
export const SPARK_ZIGZAG_VELOCITY = 620;
/** How quickly horizontal velocity tracks the zig-zag sine target. */
export const SPARK_ZIGZAG_STEER_RATE = 22;

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
    dragMin: 0.958,
    dragRange: 0.016,
    rotationSpeed: 10,
    fadeStartMin: 0.42,
    fadeStartRange: 0.22,
    fadeDurationMin: 0.58,
    fadeDurationRange: 0.42,
  },
};

export const getParticleMotionProfile = (
  motionMode: DisintegrateParticleMotionMode,
): ParticleMotionProfile => PARTICLE_MOTION_PROFILES[motionMode];
