import { resolveThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/resolveThanosDisintegrateOptions";
import type {
  ThanosDisintegrateOptions,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";

type CreateParticleInput = {
  x: number;
  y: number;
  color: string;
  alpha: number;
  surfaceWidth: number;
  surfaceHeight: number;
  options?: ThanosDisintegrateOptions;
};

/** Creates one particle with outward-biased velocity, drag, rotation, and fade timing. */
export const createThanosParticle = ({
  x,
  y,
  color,
  alpha,
  surfaceWidth,
  surfaceHeight,
  options,
}: CreateParticleInput): ThanosParticle => {
  const resolvedOptions = resolveThanosDisintegrateOptions(options);
  const centerX = surfaceWidth / 2;
  const centerY = surfaceHeight / 2;
  const deltaX = x - centerX;
  const deltaY = y - centerY;
  const distanceFromCenter = Math.hypot(deltaX, deltaY);
  const baseAngle =
    distanceFromCenter > 0.5
      ? Math.atan2(deltaY, deltaX)
      : Math.random() * Math.PI * 2;
  const spread = (Math.random() - 0.5) * 1.2;
  const angle = baseAngle + spread;
  const speed = resolvedOptions.maxVelocity * (0.45 + Math.random() * 0.75);

  return {
    x,
    y,
    originX: x,
    originY: y,
    vx: Math.cos(angle) * speed + resolvedOptions.windX,
    vy: Math.sin(angle) * speed + resolvedOptions.windY,
    color,
    alpha,
    baseAlpha: alpha,
    size: resolvedOptions.particleSize * (0.75 + Math.random() * 0.45),
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 5,
    drag: 0.955 + Math.random() * 0.03,
    fadeStart: 0.45 + Math.random() * 0.25,
    fadeDuration: 0.3 + Math.random() * 0.35,
    releaseTime: 0,
  };
};
