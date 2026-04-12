/**
 * Tuning for `useHeroOrbitModelMotion`: desktop (mouse) vs mobile (touch + idle).
 *
 * `frameDamping` is the per-frame lerp factor toward the target angle (0–1).
 * Lower = smoother, heavier follow; higher = snappier (1 = instant each frame).
 */
export const LANDING_HERO_ORBIT_TUNING = {
  desktop: {
    maxAzimuthOffset: 0.28,
    maxPolarOffset: 0.18,
    frameDamping: 0.032,
    pointerAzimuthMultiplier: 2,
    pointerPolarMultiplier: 2,
    polarAngleMin: Math.PI / 2.9,
    polarAngleMax: Math.PI / 1.9,
  },
  mobile: {
    maxAzimuthOffset: 0.62,
    maxPolarOffset: 0.4,
    frameDamping: 0.058,
    polarAngleMin: Math.PI / 3.15,
    polarAngleMax: Math.PI / 1.72,
    /** Finger position → orbit offset; polar higher so vertical screen position reads clearly. */
    touchAzimuthMultiplier: 5.8,
    touchPolarMultiplier: 11.2,
    /** Subtle continuous drift so decor reads as 3D without interaction. */
    idleAzimuthAmplitudeRad: 0.13,
    idlePolarAmplitudeRad: 0.075,
    idleAzimuthAngularSpeed: 0.38,
    idlePolarAngularSpeed: 0.52,
    idleSecondaryAzimuthScale: 0.42,
    idleSecondaryPolarScale: 0.38,
    idleSmoothing: 0.034,
    /** Per frame when finger lifted: delta *= (1 - value). Lower = slower, smoother settle. */
    touchReleaseDecay: 0.022,
  },
} as const;
