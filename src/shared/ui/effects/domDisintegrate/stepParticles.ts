import { resolveDomDisintegrateOptions } from "#/shared/ui/effects/domDisintegrate/resolveDomDisintegrateOptions";
import { sampleSparkFlutter } from "#/shared/ui/effects/domDisintegrate/sparkFlutter";
import {
  SPARK_BUOYANCY,
  SPARK_BUOYANCY_DECAY,
  SPARK_FLUTTER_STRENGTH,
  SPARK_GRAVITY_RAMP_SECONDS,
  SPARK_WIND_MULTIPLIER,
  SPARK_ZIGZAG_FREQUENCY,
  SPARK_ZIGZAG_STEER_RATE,
  SPARK_ZIGZAG_VELOCITY,
} from "#/shared/ui/effects/domDisintegrate/sparkParticlePhysics";
import type {
  DisintegrateParticle,
  DomDisintegrateOptions,
} from "#/shared/ui/effects/domDisintegrate/types";

const applyDrag = (velocity: number, drag: number, deltaSeconds: number) =>
  velocity * Math.pow(drag, deltaSeconds * 60);

const updateFadeAlpha = (
  particle: DisintegrateParticle,
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
  particle: DisintegrateParticle,
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
  particle: DisintegrateParticle,
  deltaSeconds: number,
  timeSinceRelease: number,
  windX: number,
  windY: number,
  gravity: number,
): void => {
  particle.vx = applyDrag(particle.vx, particle.drag, deltaSeconds);
  particle.vy = applyDrag(particle.vy, particle.drag, deltaSeconds);

  const zigzagPhase =
    timeSinceRelease * SPARK_ZIGZAG_FREQUENCY + particle.turbulenceSeed * 0.09;
  const targetZigzagVx = Math.sin(zigzagPhase) * SPARK_ZIGZAG_VELOCITY;
  particle.vx +=
    (targetZigzagVx - particle.vx) *
    Math.min(1, deltaSeconds * SPARK_ZIGZAG_STEER_RATE);

  const flutter = sampleSparkFlutter(timeSinceRelease, particle.turbulenceSeed);
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
  particles: DisintegrateParticle[],
  deltaSeconds: number,
  elapsedSeconds: number,
  options?: DomDisintegrateOptions,
): number => {
  const resolvedOptions = resolveDomDisintegrateOptions(options);
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
