import type { DisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/types";

export type ActiveParticleTracker = {
  /** Adds particles whose release time has passed. */
  syncReleased: (elapsedSeconds: number) => void;
  /** Drops faded particles from the active list. */
  removeDead: () => void;
  getActive: () => readonly DisintegrateParticle[];
  getVisibleCount: () => number;
};

/** Tracks released particles so step/draw loops skip unreleased and dead entries. */
export const createActiveParticleTracker = (
  particles: DisintegrateParticle[],
): ActiveParticleTracker => {
  const sortedByRelease = [...particles].sort(
    (left, right) => left.releaseTime - right.releaseTime,
  );
  const active: DisintegrateParticle[] = [];
  let nextReleaseIndex = 0;

  const syncReleased = (elapsedSeconds: number): void => {
    while (nextReleaseIndex < sortedByRelease.length) {
      const particle = sortedByRelease[nextReleaseIndex];
      if (!particle || particle.releaseTime > elapsedSeconds) {
        break;
      }

      active.push(particle);
      nextReleaseIndex += 1;
    }
  };

  const removeDead = (): void => {
    for (let index = active.length - 1; index >= 0; index -= 1) {
      const particle = active[index];
      if (particle && particle.alpha <= 0.01) {
        active.splice(index, 1);
      }
    }
  };

  const getVisibleCount = (): number => {
    const unreleasedCount = sortedByRelease.length - nextReleaseIndex;
    let aliveActiveCount = 0;

    for (const particle of active) {
      if (particle.alpha > 0.01) {
        aliveActiveCount += 1;
      }
    }

    return unreleasedCount + aliveActiveCount;
  };

  return {
    syncReleased,
    removeDead,
    getActive: () => active,
    getVisibleCount,
  };
};
