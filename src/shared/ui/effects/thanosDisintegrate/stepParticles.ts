import { resolveThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/resolveThanosDisintegrateOptions";
import type {
  ThanosDisintegrateOptions,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";
import { sampleWindFlow } from "#/shared/ui/effects/thanosDisintegrate/windTurbulence";

const WINDY_FLOW_STRENGTH = 320;
const WINDY_WIND_MULTIPLIER = 1.8;
const WINDY_GRAVITY_MULTIPLIER = 0.35;

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

const stepWindyParticle = (
  particle: ThanosParticle,
  deltaSeconds: number,
  elapsedSeconds: number,
  windX: number,
  windY: number,
  gravity: number,
): void => {
  particle.vx = applyDrag(particle.vx, particle.drag, deltaSeconds);
  particle.vy = applyDrag(particle.vy, particle.drag, deltaSeconds);

  const flow = sampleWindFlow(
    particle.x,
    particle.y,
    elapsedSeconds,
    particle.turbulenceSeed,
  );

  particle.vx +=
    (flow.forceX * WINDY_FLOW_STRENGTH + windX * WINDY_WIND_MULTIPLIER) *
    deltaSeconds;
  particle.vy +=
    (flow.forceY * WINDY_FLOW_STRENGTH +
      windY * WINDY_WIND_MULTIPLIER +
      gravity * WINDY_GRAVITY_MULTIPLIER) *
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
      stepWindyParticle(
        particle,
        deltaSeconds,
        elapsedSeconds,
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
