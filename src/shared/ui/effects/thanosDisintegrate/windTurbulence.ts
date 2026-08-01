/**
 * Lightweight turbulence for windy (fire-spark) particle steering.
 * Combines high-frequency flutter with smooth noise for organic wavering.
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

export type SparkFlutterSample = {
  forceX: number;
  forceY: number;
};

/**
 * High-frequency flutter forces that make sparks waver and zig-zag in the air.
 * Each particle uses its own phase via turbulenceSeed.
 */
export const sampleSparkFlutter = (
  elapsedSeconds: number,
  turbulenceSeed: number,
): SparkFlutterSample => {
  const phase = elapsedSeconds + turbulenceSeed * 0.017;
  const drift = sampleWindNoise2D(phase * 0.75, turbulenceSeed * 0.04) * 0.18;

  return {
    forceX:
      Math.sin(phase * 19.3) * 0.42 +
      Math.sin(phase * 33.7 + turbulenceSeed) * 0.28 +
      Math.cos(phase * 47.1) * 0.14 +
      drift,
    forceY:
      Math.cos(phase * 24.5 + turbulenceSeed * 0.5) * 0.16 +
      Math.sin(phase * 38.9) * 0.1 +
      drift * 0.35,
  };
};
