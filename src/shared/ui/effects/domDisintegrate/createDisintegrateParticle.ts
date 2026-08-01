import { resolveDomDisintegrateOptions } from "#/shared/ui/effects/domDisintegrate/resolveDomDisintegrateOptions";
import { getParticleMotionProfile } from "#/shared/ui/effects/domDisintegrate/sparkParticlePhysics";
import type {
  DisintegrateParticle,
  DomDisintegrateOptions,
} from "#/shared/ui/effects/domDisintegrate/types";

type CreateParticleInput = {
  x: number;
  y: number;
  color: string;
  alpha: number;
  surfaceWidth: number;
  surfaceHeight: number;
  options?: DomDisintegrateOptions;
};

const createSplatVelocity = (
  x: number,
  y: number,
  surfaceWidth: number,
  surfaceHeight: number,
  resolvedOptions: ReturnType<typeof resolveDomDisintegrateOptions>,
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

const createSparkVelocity = (
  resolvedOptions: ReturnType<typeof resolveDomDisintegrateOptions>,
): { vx: number; vy: number } => {
  const launchAngle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
  const speed = resolvedOptions.maxVelocity * (0.42 + Math.random() * 0.62);

  return {
    vx:
      Math.cos(launchAngle) * speed * 0.38 +
      resolvedOptions.windX * 0.2 +
      (Math.random() - 0.5) * resolvedOptions.maxVelocity * 0.16,
    vy:
      Math.sin(launchAngle) * speed -
      resolvedOptions.maxVelocity * (0.1 + Math.random() * 0.16),
  };
};

/** Creates one particle with outward-biased velocity, drag, rotation, and fade timing. */
export const createDisintegrateParticle = ({
  x,
  y,
  color,
  alpha,
  surfaceWidth,
  surfaceHeight,
  options,
}: CreateParticleInput): DisintegrateParticle => {
  const resolvedOptions = resolveDomDisintegrateOptions(options);
  const motionProfile = getParticleMotionProfile(
    resolvedOptions.particleMotionMode,
  );
  const velocity =
    resolvedOptions.particleMotionMode === "windy"
      ? createSparkVelocity(resolvedOptions)
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
    rotationSpeed: (Math.random() - 0.5) * motionProfile.rotationSpeed,
    drag: motionProfile.dragMin + Math.random() * motionProfile.dragRange,
    fadeStart:
      motionProfile.fadeStartMin + Math.random() * motionProfile.fadeStartRange,
    fadeDuration:
      motionProfile.fadeDurationMin +
      Math.random() * motionProfile.fadeDurationRange,
    releaseTime: 0,
    turbulenceSeed: Math.random() * 1000,
  };
};
