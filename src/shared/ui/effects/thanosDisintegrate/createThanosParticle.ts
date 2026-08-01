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
  const windAngle = Math.atan2(
    resolvedOptions.windY,
    Math.max(12, Math.abs(resolvedOptions.windX)),
  );
  const spread = (Math.random() - 0.5) * 1.1;
  const angle = windAngle + spread;
  const speed = resolvedOptions.maxVelocity * (0.12 + Math.random() * 0.38);

  return {
    vx:
      Math.cos(angle) * speed +
      resolvedOptions.windX * (0.35 + Math.random() * 0.25),
    vy:
      Math.sin(angle) * speed +
      resolvedOptions.windY * 0.35 -
      resolvedOptions.maxVelocity * (0.04 + Math.random() * 0.08),
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
  const velocity =
    resolvedOptions.particleMotionMode === "windy"
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
    rotationSpeed: (Math.random() - 0.5) * 5,
    drag:
      resolvedOptions.particleMotionMode === "windy"
        ? 0.972 + Math.random() * 0.02
        : 0.955 + Math.random() * 0.03,
    fadeStart: 0.45 + Math.random() * 0.25,
    fadeDuration: 0.3 + Math.random() * 0.35,
    releaseTime: 0,
    turbulenceSeed: Math.random() * 1000,
  };
};
