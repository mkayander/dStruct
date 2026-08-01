type SparkFlutterForces = {
  forceX: number;
  forceY: number;
};

/** High-frequency oscillation that makes sparks waver and zig-zag in the air. */
export const sampleSparkFlutter = (
  elapsedSeconds: number,
  turbulenceSeed: number,
): SparkFlutterForces => {
  const phase = elapsedSeconds + turbulenceSeed * 0.017;

  return {
    forceX:
      Math.sin(phase * 19.3) * 0.42 +
      Math.sin(phase * 33.7 + turbulenceSeed) * 0.28 +
      Math.cos(phase * 47.1) * 0.14 +
      Math.sin(phase * 11.2 + turbulenceSeed * 0.35) * 0.12,
    forceY:
      Math.cos(phase * 24.5 + turbulenceSeed * 0.5) * 0.16 +
      Math.sin(phase * 38.9) * 0.1 +
      Math.cos(phase * 15.8 + turbulenceSeed * 0.2) * 0.08,
  };
};
