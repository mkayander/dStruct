import type { DisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/types";

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
  turbulenceSeed: 0,
  ...overrides,
});
