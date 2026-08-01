/**
 * Lightweight 2D value noise for windy particle steering.
 * Produces smooth, spatially continuous gusts without external dependencies.
 */

const PERMUTATION_SIZE = 256;
const PERMUTATION_TABLE = new Uint8Array(PERMUTATION_SIZE * 2);

let isPermutationInitialized = false;

const initializePermutationTable = (): void => {
  if (isPermutationInitialized) {
    return;
  }

  for (let index = 0; index < PERMUTATION_SIZE; index += 1) {
    PERMUTATION_TABLE[index] = index;
  }

  for (let index = PERMUTATION_SIZE - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = PERMUTATION_TABLE[index] ?? 0;
    PERMUTATION_TABLE[index] = PERMUTATION_TABLE[swapIndex] ?? 0;
    PERMUTATION_TABLE[swapIndex] = current;
  }

  for (let index = 0; index < PERMUTATION_SIZE; index += 1) {
    PERMUTATION_TABLE[index + PERMUTATION_SIZE] = PERMUTATION_TABLE[index] ?? 0;
  }

  isPermutationInitialized = true;
};

const fade = (value: number): number =>
  value * value * value * (value * (value * 6 - 15) + 10);

const lerp = (start: number, end: number, amount: number): number =>
  start + amount * (end - start);

const grad = (hash: number, x: number, y: number): number => {
  const corner = hash & 3;
  const axisU = corner < 2 ? x : y;
  const axisV = corner < 2 ? y : x;
  return (
    ((corner & 1) === 0 ? axisU : -axisU) +
    ((corner & 2) === 0 ? axisV : -axisV)
  );
};

/** Classic Perlin-style 2D noise in approximately [-1, 1]. */
export const sampleWindNoise2D = (x: number, y: number): number => {
  initializePermutationTable();

  const cellX = Math.floor(x) & 255;
  const cellY = Math.floor(y) & 255;
  const localX = x - Math.floor(x);
  const localY = y - Math.floor(y);
  const fadeX = fade(localX);
  const fadeY = fade(localY);

  const aa = PERMUTATION_TABLE[cellX] ?? 0;
  const ab = PERMUTATION_TABLE[cellX + 1] ?? 0;
  const hashA = PERMUTATION_TABLE[(aa + cellY) & 255] ?? 0;
  const hashB = PERMUTATION_TABLE[(ab + cellY) & 255] ?? 0;
  const hashC = PERMUTATION_TABLE[(aa + cellY + 1) & 255] ?? 0;
  const hashD = PERMUTATION_TABLE[(ab + cellY + 1) & 255] ?? 0;

  const x1 = lerp(
    grad(hashA, localX, localY),
    grad(hashB, localX - 1, localY),
    fadeX,
  );
  const x2 = lerp(
    grad(hashC, localX, localY - 1),
    grad(hashD, localX - 1, localY - 1),
    fadeX,
  );

  return lerp(x1, x2, fadeY);
};

const WIND_NOISE_SCALE = 0.012;
const WIND_TIME_SCALE = 1.4;

export type WindFlowSample = {
  forceX: number;
  forceY: number;
};

/**
 * Samples a time-varying flow field at a particle position.
 * Nearby particles receive similar forces; gusts evolve over the animation.
 */
export const sampleWindFlow = (
  x: number,
  y: number,
  elapsedSeconds: number,
  turbulenceSeed: number,
): WindFlowSample => {
  const timeOffset = elapsedSeconds * WIND_TIME_SCALE + turbulenceSeed;
  const noiseX = x * WIND_NOISE_SCALE;
  const noiseY = y * WIND_NOISE_SCALE;

  const flowAngle =
    sampleWindNoise2D(noiseX + timeOffset, noiseY - timeOffset * 0.65) *
      Math.PI *
      2.2 +
    sampleWindNoise2D(
      noiseX * 1.7 - timeOffset * 0.4,
      noiseY * 1.3 + timeOffset * 0.55 + turbulenceSeed,
    ) *
      Math.PI *
      0.9;

  const gustStrength =
    0.55 +
    0.45 *
      sampleWindNoise2D(
        noiseX * 0.6 + turbulenceSeed * 0.2,
        noiseY * 0.6 - timeOffset * 0.25,
      );

  return {
    forceX: Math.cos(flowAngle) * gustStrength,
    forceY: Math.sin(flowAngle) * gustStrength,
  };
};
