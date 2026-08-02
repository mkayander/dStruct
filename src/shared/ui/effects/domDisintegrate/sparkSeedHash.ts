/** Deterministic [0, 1) hash for per-particle spark variation. */
export const hashSparkSeed01 = (seed: number): number => {
  const value = Math.sin(seed) * 43758.5453123;
  return value - Math.floor(value);
};
