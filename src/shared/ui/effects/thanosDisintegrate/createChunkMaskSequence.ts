import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

export type ChunkMaskSequence = {
  /** Elapsed times (seconds) at which the mask advances to the next step. */
  timeThresholds: number[];
  modalMaskUrls: string[];
  particleMaskUrls: string[];
  modalMaskSize: string;
  particleMaskSize: string;
  revoke: () => void;
};

const CHUNK_TIME_QUANTUM_SECONDS = 1 / 60;

const quantizeReleaseTime = (releaseTime: number): number =>
  Math.round(releaseTime / CHUNK_TIME_QUANTUM_SECONDS) *
  CHUNK_TIME_QUANTUM_SECONDS;

/** Buckets particle release times into a bounded number of mask steps. */
export const buildChunkMaskThresholds = (
  particles: ThanosParticle[],
  maxSteps: number,
): number[] => {
  const quantizedTimes = new Set<number>();
  for (const particle of particles) {
    quantizedTimes.add(quantizeReleaseTime(particle.releaseTime));
  }

  const sortedTimes = Array.from(quantizedTimes).sort(
    (left, right) => left - right,
  );
  if (sortedTimes.length <= maxSteps) {
    return sortedTimes;
  }

  if (maxSteps <= 1) {
    return [sortedTimes.at(-1) ?? 0];
  }

  const bucketed: number[] = [];
  const lastIndex = sortedTimes.length - 1;
  for (let stepIndex = 0; stepIndex < maxSteps; stepIndex += 1) {
    const sourceIndex = Math.round((stepIndex / (maxSteps - 1)) * lastIndex);
    bucketed.push(sortedTimes[sourceIndex] ?? 0);
  }

  return Array.from(new Set(bucketed)).sort((left, right) => left - right);
};

export const getChunkMaskIndex = (
  timeThresholds: number[],
  elapsedSeconds: number,
): number => {
  if (timeThresholds.length === 0) {
    return 0;
  }

  let index = 0;
  while (
    index < timeThresholds.length - 1 &&
    elapsedSeconds >= timeThresholds[index + 1]!
  ) {
    index += 1;
  }

  return index;
};

const renderModalChunkMask = (
  context: CanvasRenderingContext2D,
  particles: ThanosParticle[],
  releaseThreshold: number,
  originOffset: number,
  chunkSize: number,
): void => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  for (const particle of particles) {
    if (particle.releaseTime > releaseThreshold) {
      context.fillStyle = "#000000";
      context.fillRect(
        particle.x + originOffset,
        particle.y + originOffset,
        chunkSize,
        chunkSize,
      );
    }
  }
};

const renderParticleChunkMask = (
  context: CanvasRenderingContext2D,
  particles: ThanosParticle[],
  releaseThreshold: number,
  originOffset: number,
  chunkSize: number,
): void => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  for (const particle of particles) {
    if (particle.releaseTime <= releaseThreshold) {
      context.fillStyle = "#000000";
      context.fillRect(
        particle.x + originOffset,
        particle.y + originOffset,
        chunkSize,
        chunkSize,
      );
    }
  }
};

const createMaskDataUrl = (
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D) => void,
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("2d canvas context unavailable");
  }

  draw(context);
  return canvas.toDataURL("image/png");
};

/** Pre-renders modal + particle bitmask masks for each crumble chunk. */
export const createChunkMaskSequence = (
  particles: ThanosParticle[],
  displayWidth: number,
  displayHeight: number,
  particlePadding: number,
  chunkSize: number,
  maxSteps: number,
): ChunkMaskSequence => {
  const timeThresholds = buildChunkMaskThresholds(particles, maxSteps);
  const modalMaskUrls: string[] = [];
  const particleMaskUrls: string[] = [];
  const modalMaskSize = `${displayWidth}px ${displayHeight}px`;
  const canvasWidth = displayWidth + particlePadding * 2;
  const canvasHeight = displayHeight + particlePadding * 2;
  const particleMaskSize = `${canvasWidth}px ${canvasHeight}px`;

  const steps =
    timeThresholds.length > 0
      ? timeThresholds
      : [Number.NEGATIVE_INFINITY];

  for (const releaseThreshold of steps) {
    modalMaskUrls.push(
      createMaskDataUrl(displayWidth, displayHeight, (context) => {
        renderModalChunkMask(
          context,
          particles,
          releaseThreshold,
          0,
          chunkSize,
        );
      }),
    );
    particleMaskUrls.push(
      createMaskDataUrl(canvasWidth, canvasHeight, (context) => {
        renderParticleChunkMask(
          context,
          particles,
          releaseThreshold,
          particlePadding,
          chunkSize,
        );
      }),
    );
  }

  return {
    timeThresholds,
    modalMaskUrls,
    particleMaskUrls,
    modalMaskSize,
    particleMaskSize,
    revoke: () => {},
  };
};
