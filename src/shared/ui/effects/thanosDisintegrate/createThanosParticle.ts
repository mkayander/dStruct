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

const createSplatVelocity = (
  x: number,
  y: number,
  surfaceWidth: number,
  surfaceHeight: number,
  resolvedOptions: ReturnType<typeof resolveThanosDisintegrateOptions>,
): { vx: number; vy: number } => {
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
    vx: Math.cos(angle) * speed + resolvedOptions.windX,
    vy: Math.sin(angle) * speed + resolvedOptions.windY,
  };
};

const createWindyVelocity = (
  resolvedOptions: ReturnType<typeof resolveThanosDisintegrateOptions>,
): { vx: number; vy: number } => {
  const launchAngle = -Math.PI / 2 + (Math.random() - 0.5) * 1.35;
  const speed = resolvedOptions.maxVelocity * (0.32 + Math.random() * 0.58);

  return {
    vx:
      Math.cos(launchAngle) * speed * 0.42 +
      resolvedOptions.windX * 0.25 +
      (Math.random() - 0.5) * resolvedOptions.maxVelocity * 0.18,
    vy:
      Math.sin(launchAngle) * speed -
      resolvedOptions.maxVelocity * (0.08 + Math.random() * 0.14),
  };
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
  const isWindy = resolvedOptions.particleMotionMode === "windy";
  const velocity = isWindy
    ? createWindyVelocity(resolvedOptions)
    : createSplatVelocity(x, y, surfaceWidth, surfaceHeight, resolvedOptions);

  return {
    x,
    y,
    originX: x,
    originY: y,
    vx: velocity.vx,
    vy: velocity.vy,
    color,
    alpha,
    baseAlpha: alpha,
    size: resolvedOptions.particleSize * (0.75 + Math.random() * 0.45),
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * (isWindy ? 9 : 5),
    drag: isWindy
      ? 0.978 + Math.random() * 0.015
      : 0.955 + Math.random() * 0.03,
    fadeStart: isWindy
      ? 0.22 + Math.random() * 0.18
      : 0.45 + Math.random() * 0.25,
    fadeDuration: isWindy
      ? 0.22 + Math.random() * 0.24
      : 0.3 + Math.random() * 0.35,
    releaseTime: 0,
    turbulenceSeed: Math.random() * 1000,
  };
};
