import { resolveThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/resolveThanosDisintegrateOptions";
import { sampleSparkFlutter } from "#/shared/ui/effects/thanosDisintegrate/sparkFlutter";
import {
  SPARK_BUOYANCY,
  SPARK_BUOYANCY_DECAY,
  SPARK_FLUTTER_STRENGTH,
  SPARK_GRAVITY_RAMP_SECONDS,
  SPARK_WIND_MULTIPLIER,
} from "#/shared/ui/effects/thanosDisintegrate/sparkParticlePhysics";
import type {
  ThanosDisintegrateOptions,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";

const applyDrag = (velocity: number, drag: number, deltaSeconds: number) =>
  velocity * Math.pow(drag, deltaSeconds * 60);

const updateFadeAlpha = (
  particle: ThanosParticle,
  timeSinceRelease: number,
): void => {
  const progress = timeSinceRelease / particle.fadeDuration;
  if (progress <= particle.fadeStart) {
    particle.alpha = particle.baseAlpha;
    return;
  }

  const fadeProgress =
    (progress - particle.fadeStart) / Math.max(0.001, 1 - particle.fadeStart);
  particle.alpha = particle.baseAlpha * Math.max(0, 1 - fadeProgress);
};

const stepSplatParticle = (
  particle: ThanosParticle,
  deltaSeconds: number,
  windX: number,
  windY: number,
  gravity: number,
): void => {
  particle.vx = applyDrag(particle.vx, particle.drag, deltaSeconds);
  particle.vy = applyDrag(particle.vy, particle.drag, deltaSeconds);
  particle.vx += windX * deltaSeconds;
  particle.vy += gravity * deltaSeconds + windY * deltaSeconds;
  particle.x += particle.vx * deltaSeconds;
  particle.y += particle.vy * deltaSeconds;
};

const stepSparkParticle = (
  particle: ThanosParticle,
  deltaSeconds: number,
  elapsedSeconds: number,
  timeSinceRelease: number,
  windX: number,
  windY: number,
  gravity: number,
): void => {
  particle.vx = applyDrag(particle.vx, particle.drag, deltaSeconds);
  particle.vy = applyDrag(particle.vy, particle.drag, deltaSeconds);

  const flutter = sampleSparkFlutter(elapsedSeconds, particle.turbulenceSeed);
  const buoyancy =
    SPARK_BUOYANCY * Math.exp(-timeSinceRelease * SPARK_BUOYANCY_DECAY);
  const gravityRamp = Math.min(
    1,
    timeSinceRelease / SPARK_GRAVITY_RAMP_SECONDS,
  );

  particle.vx +=
    (flutter.forceX * SPARK_FLUTTER_STRENGTH + windX * SPARK_WIND_MULTIPLIER) *
    deltaSeconds;
  particle.vy +=
    (flutter.forceY * SPARK_FLUTTER_STRENGTH +
      buoyancy +
      gravity * gravityRamp +
      windY * SPARK_WIND_MULTIPLIER) *
    deltaSeconds;
  particle.x += particle.vx * deltaSeconds;
  particle.y += particle.vy * deltaSeconds;
};

/** Advances particle physics using delta time (stable on high-refresh displays). */
export const stepParticles = (
  particles: ThanosParticle[],
  deltaSeconds: number,
  elapsedSeconds: number,
  options?: ThanosDisintegrateOptions,
): number => {
  const resolvedOptions = resolveThanosDisintegrateOptions(options);
  let visibleCount = 0;

  for (const particle of particles) {
    if (elapsedSeconds < particle.releaseTime) {
      visibleCount += 1;
      continue;
    }

    const timeSinceRelease = elapsedSeconds - particle.releaseTime;

    if (resolvedOptions.particleMotionMode === "windy") {
      stepSparkParticle(
        particle,
        deltaSeconds,
        elapsedSeconds,
        timeSinceRelease,
        resolvedOptions.windX,
        resolvedOptions.windY,
        resolvedOptions.gravity,
      );
    } else {
      stepSplatParticle(
        particle,
        deltaSeconds,
        resolvedOptions.windX,
        resolvedOptions.windY,
        resolvedOptions.gravity,
      );
    }

    particle.rotation += particle.rotationSpeed * deltaSeconds;
    updateFadeAlpha(particle, timeSinceRelease);

    if (particle.alpha > 0.01) {
      visibleCount += 1;
    }
  }

  return visibleCount;
};
