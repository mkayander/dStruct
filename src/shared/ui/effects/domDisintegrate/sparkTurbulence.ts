import { hashSparkSeed01 } from "#/shared/ui/effects/domDisintegrate/sparkSeedHash";

type SparkTurbulenceForces = {
  forceX: number;
  forceY: number;
};

export type SparkTurbulenceInput = {
  originX: number;
  originY: number;
  timeSinceRelease: number;
  turbulenceSeed: number;
  /** Pixels risen above the spawn point (positive when moving up). */
  verticalTravel: number;
};

export type SparkTurbulenceProfile = {
  influence: number;
  frequency: number;
  phase: number;
  noiseScale: number;
};

export const createSparkTurbulenceProfile = (
  turbulenceSeed: number,
): SparkTurbulenceProfile => ({
  influence: 0.42 + hashSparkSeed01(turbulenceSeed * 1.17) * 0.52,
  frequency: 2.1 + hashSparkSeed01(turbulenceSeed * 2.31) * 3.4,
  phase: hashSparkSeed01(turbulenceSeed * 3.79) * Math.PI * 2,
  noiseScale: 0.75 + hashSparkSeed01(turbulenceSeed * 5.13) * 0.85,
});

/**
 * Wind-borne spark turbulence: per-particle phase/frequency, position-based
 * noise, and lateral sway that ramps with vertical travel (not time alone).
 */
export const sampleSparkTurbulence = (
  {
    originX,
    originY,
    timeSinceRelease,
    turbulenceSeed,
    verticalTravel,
  }: SparkTurbulenceInput,
  profile: SparkTurbulenceProfile,
): SparkTurbulenceForces => {
  const travelFactor = Math.min(1, verticalTravel / 56);
  const swayEnvelope = 0.08 + travelFactor * 0.92;

  const slowPhase = timeSinceRelease * profile.frequency + profile.phase;

  const positionNoise =
    Math.sin(originX * 0.044 + slowPhase * 0.32 + turbulenceSeed) *
    Math.cos(originY * 0.036 + turbulenceSeed * 0.43);

  const sway =
    Math.sin(slowPhase) * 0.64 +
    Math.sin(slowPhase * 0.58 + turbulenceSeed * 0.17) * 0.36;

  const eddy =
    Math.sin(originX * 0.055 + timeSinceRelease * 1.15 + turbulenceSeed) *
      0.22 +
    Math.cos(
      originY * 0.048 + timeSinceRelease * 0.95 + turbulenceSeed * 0.66,
    ) *
      0.14;

  return {
    forceX:
      (sway * swayEnvelope + positionNoise * 0.38 + eddy) *
      profile.influence *
      profile.noiseScale,
    forceY: 0,
  };
};
