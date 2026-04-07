/**
 * Tuning for `useHeroOrbitModelMotion`: separate desktop (pointer) vs mobile (scroll) behavior.
 */
export const LANDING_HERO_ORBIT_TUNING = {
  desktop: {
    maxAzimuthOffset: 0.28,
    maxPolarOffset: 0.18,
    frameDamping: 0.08,
    pointerAzimuthMultiplier: 2,
    pointerPolarMultiplier: 2,
    polarAngleMin: Math.PI / 2.9,
    polarAngleMax: Math.PI / 1.9,
  },
  mobile: {
    maxAzimuthOffset: 0.62,
    maxPolarOffset: 0.4,
    frameDamping: 0.2,
    scrollAzimuthMultiplier: 3.4,
    scrollPolarMultiplier: 3.6,
    polarAngleMin: Math.PI / 3.15,
    polarAngleMax: Math.PI / 1.72,
  },
} as const;
