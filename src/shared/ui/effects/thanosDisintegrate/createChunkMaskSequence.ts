import { canvasToDataUrl } from "#/shared/ui/effects/thanosDisintegrate/canvasToDataUrl";
import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

type Mask2dContext =
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D;

export type ChunkMaskParticle = Pick<ThanosParticle, "x" | "y" | "releaseTime">;

export type ChunkMaskSequence = {
  /** Elapsed times (seconds) at which the mask advances to the next step. */
  timeThresholds: number[];
  modalMaskUrls: string[];
  particleMaskUrls: string[];
  modalMaskSize: string;
  particleMaskSize: string;
  revoke: () => void;
};

export type ChunkMaskSequenceInput = {
  particles: ChunkMaskParticle[];
  displayWidth: number;
  displayHeight: number;
  particlePadding: number;
  /** Extra radius around each chunk reveal so outward-flying particles stay visible. */
  particleRevealMargin: number;
  chunkSize: number;
  maxSteps: number;
};

export type CreateChunkMaskSequenceAsyncOptions = {
  /** Prefer OffscreenCanvas so encoding uses async convertToBlob instead of sync toDataURL. */
  preferOffscreen?: boolean;
  /** Yield to the browser between mask steps (tests / explicit non-worker builds). */
  yieldBetweenSteps?: boolean;
};

export const CHUNK_TIME_QUANTUM_SECONDS = 1 / 60;

const yieldToMainThread = (): Promise<void> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });

export const quantizeReleaseTime = (releaseTime: number): number =>
  Math.round(releaseTime / CHUNK_TIME_QUANTUM_SECONDS) *
  CHUNK_TIME_QUANTUM_SECONDS;

const groupParticlesByReleaseTime = (
  particles: ChunkMaskParticle[],
): Map<number, ChunkMaskParticle[]> => {
  const groups = new Map<number, ChunkMaskParticle[]>();

  for (const particle of particles) {
    const quantizedTime = quantizeReleaseTime(particle.releaseTime);
    const bucket = groups.get(quantizedTime);
    if (bucket) {
      bucket.push(particle);
    } else {
      groups.set(quantizedTime, [particle]);
    }
  }

  return groups;
};

/** Buckets particle release times into a bounded number of mask steps. */
export const buildChunkMaskThresholds = (
  particles: ChunkMaskParticle[],
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

const punchModalChunk = (
  context: Mask2dContext,
  particle: ChunkMaskParticle,
  originOffset: number,
  chunkSize: number,
): void => {
  context.clearRect(
    particle.x + originOffset,
    particle.y + originOffset,
    chunkSize,
    chunkSize,
  );
};

/** Padding strips are always visible so edge particles can fly into the bleed zone. */
export const revealParticleMaskBleedZone = (
  context: Mask2dContext,
  displayWidth: number,
  displayHeight: number,
  particlePadding: number,
): void => {
  if (particlePadding <= 0) {
    return;
  }

  const canvasWidth = displayWidth + particlePadding * 2;
  const canvasHeight = displayHeight + particlePadding * 2;

  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvasWidth, particlePadding);
  context.fillRect(
    0,
    canvasHeight - particlePadding,
    canvasWidth,
    particlePadding,
  );
  context.fillRect(0, particlePadding, particlePadding, displayHeight);
  context.fillRect(
    canvasWidth - particlePadding,
    particlePadding,
    particlePadding,
    displayHeight,
  );
};

export const revealParticleChunk = (
  context: Mask2dContext,
  particle: ChunkMaskParticle,
  originOffset: number,
  chunkSize: number,
  revealMargin: number,
): void => {
  context.fillStyle = "#000000";
  context.fillRect(
    particle.x + originOffset - revealMargin,
    particle.y + originOffset - revealMargin,
    chunkSize + revealMargin * 2,
    chunkSize + revealMargin * 2,
  );
};

type MaskBuildContext = {
  modalCanvas: HTMLCanvasElement | OffscreenCanvas;
  particleCanvas: HTMLCanvasElement | OffscreenCanvas;
  modalContext: Mask2dContext;
  particleContext: Mask2dContext;
  particlePadding: number;
  particleRevealMargin: number;
  chunkSize: number;
  releaseGroups: Map<number, ChunkMaskParticle[]>;
  uniqueReleaseTimes: number[];
  timeThresholds: number[];
  modalMaskSize: string;
  particleMaskSize: string;
};

const advanceMaskSteps = (
  buildContext: MaskBuildContext,
  captureStep: () => void,
): void => {
  const {
    modalContext,
    particleContext,
    particlePadding,
    particleRevealMargin,
    chunkSize,
    releaseGroups,
    uniqueReleaseTimes,
    timeThresholds,
  } = buildContext;

  const thresholds =
    timeThresholds.length > 0 ? timeThresholds : [Number.NEGATIVE_INFINITY];
  let processedTimeIndex = 0;

  for (const threshold of thresholds) {
    while (
      processedTimeIndex < uniqueReleaseTimes.length &&
      uniqueReleaseTimes[processedTimeIndex]! <= threshold
    ) {
      const releaseTime = uniqueReleaseTimes[processedTimeIndex]!;
      const batch = releaseGroups.get(releaseTime) ?? [];

      for (const particle of batch) {
        punchModalChunk(modalContext, particle, 0, chunkSize);
        revealParticleChunk(
          particleContext,
          particle,
          particlePadding,
          chunkSize,
          particleRevealMargin,
        );
      }

      processedTimeIndex += 1;
    }

    captureStep();
  }
};

const advanceMaskStepsAsync = async (
  buildContext: MaskBuildContext,
  captureStep: () => Promise<void>,
  yieldBetweenSteps: boolean,
): Promise<void> => {
  const {
    modalContext,
    particleContext,
    particlePadding,
    particleRevealMargin,
    chunkSize,
    releaseGroups,
    uniqueReleaseTimes,
    timeThresholds,
  } = buildContext;

  const thresholds =
    timeThresholds.length > 0 ? timeThresholds : [Number.NEGATIVE_INFINITY];
  let processedTimeIndex = 0;

  for (const threshold of thresholds) {
    while (
      processedTimeIndex < uniqueReleaseTimes.length &&
      uniqueReleaseTimes[processedTimeIndex]! <= threshold
    ) {
      const releaseTime = uniqueReleaseTimes[processedTimeIndex]!;
      const batch = releaseGroups.get(releaseTime) ?? [];

      for (const particle of batch) {
        punchModalChunk(modalContext, particle, 0, chunkSize);
        revealParticleChunk(
          particleContext,
          particle,
          particlePadding,
          chunkSize,
          particleRevealMargin,
        );
      }

      processedTimeIndex += 1;
    }

    await captureStep();
    if (yieldBetweenSteps) {
      await yieldToMainThread();
    }
  }
};

const createMaskCanvas = (
  width: number,
  height: number,
  preferOffscreen: boolean,
): {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  context: Mask2dContext;
} => {
  if (preferOffscreen && typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("2d canvas context unavailable");
    }

    return { canvas, context };
  }

  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("2d canvas context unavailable");
    }

    return { canvas, context };
  }

  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("2d canvas context unavailable");
  }

  return { canvas, context };
};

const createMaskBuildContext = (
  input: ChunkMaskSequenceInput,
  preferOffscreen = false,
): MaskBuildContext => {
  const {
    particles,
    displayWidth,
    displayHeight,
    particlePadding,
    particleRevealMargin,
    chunkSize,
    maxSteps,
  } = input;

  const timeThresholds = buildChunkMaskThresholds(particles, maxSteps);
  const modalMaskSize = `${displayWidth}px ${displayHeight}px`;
  const canvasWidth = displayWidth + particlePadding * 2;
  const canvasHeight = displayHeight + particlePadding * 2;
  const particleMaskSize = `${canvasWidth}px ${canvasHeight}px`;
  const releaseGroups = groupParticlesByReleaseTime(particles);
  const uniqueReleaseTimes = Array.from(releaseGroups.keys()).sort(
    (left, right) => left - right,
  );

  const { canvas: modalCanvas, context: modalContext } = createMaskCanvas(
    displayWidth,
    displayHeight,
    preferOffscreen,
  );
  const { canvas: particleCanvas, context: particleContext } = createMaskCanvas(
    canvasWidth,
    canvasHeight,
    preferOffscreen,
  );

  modalContext.fillStyle = "#000000";
  modalContext.fillRect(0, 0, displayWidth, displayHeight);
  revealParticleMaskBleedZone(
    particleContext,
    displayWidth,
    displayHeight,
    particlePadding,
  );

  return {
    modalCanvas,
    particleCanvas,
    modalContext,
    particleContext,
    particlePadding,
    particleRevealMargin,
    chunkSize,
    releaseGroups,
    uniqueReleaseTimes,
    timeThresholds,
    modalMaskSize,
    particleMaskSize,
  };
};

/** Pre-renders modal + particle bitmask masks using cumulative punch-out. */
export const createChunkMaskSequence = (
  input: ChunkMaskSequenceInput,
): ChunkMaskSequence => {
  const buildContext = createMaskBuildContext(input);
  const modalMaskUrls: string[] = [];
  const particleMaskUrls: string[] = [];

  advanceMaskSteps(buildContext, () => {
    const modalCanvas = buildContext.modalCanvas as HTMLCanvasElement;
    const particleCanvas = buildContext.particleCanvas as HTMLCanvasElement;
    modalMaskUrls.push(modalCanvas.toDataURL("image/png"));
    particleMaskUrls.push(particleCanvas.toDataURL("image/png"));
  });

  return {
    timeThresholds: buildContext.timeThresholds,
    modalMaskUrls,
    particleMaskUrls,
    modalMaskSize: buildContext.modalMaskSize,
    particleMaskSize: buildContext.particleMaskSize,
    revoke: () => {},
  };
};

/** Async mask build for workers and yielding main-thread builds. */
export const createChunkMaskSequenceAsync = async (
  input: ChunkMaskSequenceInput,
  {
    preferOffscreen = false,
    yieldBetweenSteps = false,
  }: CreateChunkMaskSequenceAsyncOptions = {},
): Promise<ChunkMaskSequence> => {
  const buildContext = createMaskBuildContext(input, preferOffscreen);
  const modalMaskUrls: string[] = [];
  const particleMaskUrls: string[] = [];

  await advanceMaskStepsAsync(
    buildContext,
    async () => {
      modalMaskUrls.push(await canvasToDataUrl(buildContext.modalCanvas));
      particleMaskUrls.push(await canvasToDataUrl(buildContext.particleCanvas));
    },
    yieldBetweenSteps,
  );

  return {
    timeThresholds: buildContext.timeThresholds,
    modalMaskUrls,
    particleMaskUrls,
    modalMaskSize: buildContext.modalMaskSize,
    particleMaskSize: buildContext.particleMaskSize,
    revoke: () => {},
  };
};
