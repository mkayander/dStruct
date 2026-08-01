import { applyWaveOrigin } from "#/shared/ui/effects/thanosDisintegrate/applyWaveOrigin";
import { createMaskStrategyGrid } from "#/shared/ui/effects/thanosDisintegrate/maskStrategies";
import type {
  ThanosMaskStrategy,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";

const RELEASE_JITTER_SECONDS = 0.03;

export const resolveEffectiveMaskStrategy = (
  maskStrategy: ThanosMaskStrategy | undefined,
  hasClickOrigin: boolean,
): ThanosMaskStrategy => {
  if (maskStrategy) {
    return maskStrategy;
  }

  return hasClickOrigin ? "wave" : "centerOut";
};

const applyGridMaskStrategy = (
  particles: ThanosParticle[],
  strategy: Exclude<ThanosMaskStrategy, "wave">,
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
  particles: ThanosParticle[],
  {
    strategy,
    displayWidth,
    displayHeight,
    particleStep,
    maskSpreadDuration,
    waveOrigin,
    waveSpeed,
  }: {
    strategy: ThanosMaskStrategy;
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
