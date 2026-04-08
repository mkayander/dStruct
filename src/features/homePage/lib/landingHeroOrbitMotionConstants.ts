/**
 * Tuning for `useHeroOrbitModelMotion`: separate desktop (pointer) vs mobile (scroll) behavior.
 */
export const LANDING_HERO_ORBIT_TUNING = {
  desktop: {
    maxAzimuthOffset: 0.28,
    maxPolarOffset: 0.18,
    frameDamping: 0.16,
    pointerAzimuthMultiplier: 2,
    pointerPolarMultiplier: 2,
    polarAngleMin: Math.PI / 2.9,
    polarAngleMax: Math.PI / 1.9,
  },
  mobile: {
    maxAzimuthOffset: 0.62,
    maxPolarOffset: 0.4,
    frameDamping: 0.4,
    scrollAzimuthMultiplier: 3.4,
    scrollPolarMultiplier: 3.6,
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
    idleSmoothing: 0.055,
    /** Per frame: factor *= (1 - value) when finger lifted. */
    touchReleaseDecay: 0.085,
  },
} as const;
