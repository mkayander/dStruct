import { applyWaveOrigin } from "#/shared/ui/effects/domDisintegrate/applyWaveOrigin";
import { createMaskStrategyGrid } from "#/shared/ui/effects/domDisintegrate/maskStrategies";
import type {
  DisintegrateMaskStrategy,
  DisintegrateParticle,
} from "#/shared/ui/effects/domDisintegrate/types";

const RELEASE_JITTER_SECONDS = 0.03;

export const resolveEffectiveMaskStrategy = (
  maskStrategy: DisintegrateMaskStrategy | undefined,
  hasClickOrigin: boolean,
): DisintegrateMaskStrategy => {
  if (maskStrategy) {
    return maskStrategy;
  }

  return hasClickOrigin ? "wave" : "centerOut";
};

const applyGridMaskStrategy = (
  particles: DisintegrateParticle[],
  strategy: Exclude<DisintegrateMaskStrategy, "wave">,
  displayWidth: number,
  displayHeight: number,
  particleStep: number,
  maskSpreadDuration: number,
): number => {
  const cols = Math.max(1, Math.ceil(displayWidth / particleStep));
  const rows = Math.max(1, Math.ceil(displayHeight / particleStep));
  const { grid } = createMaskStrategyGrid(strategy, cols, rows);
  let maxReleaseTime = 0;

  for (const particle of particles) {
    const col = Math.min(cols - 1, Math.floor(particle.x / particleStep));
    const row = Math.min(rows - 1, Math.floor(particle.y / particleStep));
    const normalizedTime = grid[row]?.[col] ?? 0;
    const releaseTime =
      normalizedTime * maskSpreadDuration +
      Math.random() * RELEASE_JITTER_SECONDS;
    particle.releaseTime = releaseTime;
    maxReleaseTime = Math.max(maxReleaseTime, releaseTime);
  }

  return maxReleaseTime;
};

export const assignParticleReleaseTimes = (
  particles: DisintegrateParticle[],
  {
    strategy,
    displayWidth,
    displayHeight,
    particleStep,
    maskSpreadDuration,
    waveOrigin,
    waveSpeed,
  }: {
    strategy: DisintegrateMaskStrategy;
    displayWidth: number;
    displayHeight: number;
    particleStep: number;
    maskSpreadDuration: number;
    waveOrigin: { x: number; y: number } | null;
    waveSpeed: number;
  },
): number => {
  if (strategy === "wave") {
    const origin = waveOrigin ?? {
      x: displayWidth / 2,
      y: displayHeight / 2,
    };
    return applyWaveOrigin(particles, origin, waveSpeed);
  }

  return applyGridMaskStrategy(
    particles,
    strategy,
    displayWidth,
    displayHeight,
    particleStep,
    maskSpreadDuration,
  );
};
