type SparkFlutterForces = {
  forceX: number;
  forceY: number;
};

/**
 * Lateral sway and wobble along a spark's flight path.
 * Uses slower sine waves so motion reads as zig-zag, not high-frequency jitter.
 */
export const sampleSparkFlutter = (
  timeSinceRelease: number,
  turbulenceSeed: number,
): SparkFlutterForces => {
  const phase = timeSinceRelease + turbulenceSeed * 0.031;

  return {
    forceX:
      Math.sin(phase * 7.5) * 0.58 +
      Math.sin(phase * 4.2 + turbulenceSeed * 0.08) * 0.36 +
      Math.sin(phase * 11.4 + turbulenceSeed * 0.12) * 0.2,
    forceY:
      Math.cos(phase * 6.1 + turbulenceSeed * 0.15) * 0.14 +
      Math.sin(phase * 9.4) * 0.09,
  };
};
