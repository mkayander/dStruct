import { getSparkLiftFactor } from "#/shared/ui/effects/domDisintegrate/sparkParticlePhysics";
import { createSparkTurbulenceProfile } from "#/shared/ui/effects/domDisintegrate/sparkTurbulence";
import type { DisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/types";

const defaultTurbulenceSeed = 0;
const defaultTurbulenceProfile = createSparkTurbulenceProfile(
  defaultTurbulenceSeed,
);

export const createTestDisintegrateParticle = (
  overrides: Partial<DisintegrateParticle> = {},
): DisintegrateParticle => ({
  x: 0,
  y: 0,
  originX: 0,
  originY: 0,
  vx: 0,
  vy: 0,
  color: "rgb(255, 0, 0)",
  alpha: 1,
  baseAlpha: 1,
  size: 2,
  rotation: 0,
  rotationSpeed: 0,
  drag: 0.96,
  fadeStart: 0.5,
  fadeDuration: 0.4,
  releaseTime: 0,
  turbulenceSeed: defaultTurbulenceSeed,
  turbulenceInfluence: defaultTurbulenceProfile.influence,
  turbulenceFrequency: defaultTurbulenceProfile.frequency,
  turbulencePhase: defaultTurbulenceProfile.phase,
  turbulenceNoiseScale: defaultTurbulenceProfile.noiseScale,
  sparkLiftFactor: getSparkLiftFactor(defaultTurbulenceSeed),
  ...overrides,
});
