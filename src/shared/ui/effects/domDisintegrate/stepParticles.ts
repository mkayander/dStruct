import {
  SPARK_LIFT_ACCEL,
  SPARK_MAX_DOWNWARD_VELOCITY,
  SPARK_TURBULENCE_STRENGTH,
  SPARK_WIND_ACCEL,
} from "#/shared/ui/effects/domDisintegrate/sparkParticlePhysics";
import { sampleSparkTurbulence } from "#/shared/ui/effects/domDisintegrate/sparkTurbulence";
import type {
  DisintegrateParticle,
  ResolvedDomDisintegrateOptions,
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
): void => {
  particle.vx = applyDrag(particle.vx, particle.drag, deltaSeconds);
  particle.vy = applyDrag(particle.vy, particle.drag, deltaSeconds);

  const verticalTravel = Math.max(0, particle.originY - particle.y);
  const turbulence = sampleSparkTurbulence(
    {
      originX: particle.originX,
      originY: particle.originY,
      timeSinceRelease,
      turbulenceSeed: particle.turbulenceSeed,
      verticalTravel,
    },
    {
      influence: particle.turbulenceInfluence,
      frequency: particle.turbulenceFrequency,
      phase: particle.turbulencePhase,
      noiseScale: particle.turbulenceNoiseScale,
    },
  );
  const uplift = SPARK_LIFT_ACCEL * particle.sparkLiftFactor;

  particle.vx +=
    (turbulence.forceX * SPARK_TURBULENCE_STRENGTH + windX * SPARK_WIND_ACCEL) *
    deltaSeconds;
  particle.vy += (uplift + windY * SPARK_WIND_ACCEL) * deltaSeconds;
  particle.vy = Math.min(particle.vy, SPARK_MAX_DOWNWARD_VELOCITY);

  particle.x += particle.vx * deltaSeconds;
  particle.y += particle.vy * deltaSeconds;
};

/** Advances particle physics using delta time (stable on high-refresh displays). */
export const stepParticles = (
  particles: readonly DisintegrateParticle[],
  deltaSeconds: number,
  elapsedSeconds: number,
  resolvedOptions: ResolvedDomDisintegrateOptions,
): void => {
  for (const particle of particles) {
    if (elapsedSeconds < particle.releaseTime) {
      continue;
    }

    const timeSinceRelease = elapsedSeconds - particle.releaseTime;
    updateFadeAlpha(particle, timeSinceRelease);

    if (particle.alpha <= 0.01) {
      continue;
    }

    if (resolvedOptions.particleMotionMode === "windy") {
      stepSparkParticle(
        particle,
        deltaSeconds,
        timeSinceRelease,
        resolvedOptions.windX,
        resolvedOptions.windY,
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
  }
};
