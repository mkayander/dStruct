import { SPARK_ZIGZAG_FREQUENCY } from "#/shared/ui/effects/domDisintegrate/sparkParticlePhysics";

type SparkFlutterForces = {
  forceX: number;
  forceY: number;
};

/**
 * Secondary high-frequency wobble layered on top of the primary zig-zag steer.
 */
export const sampleSparkFlutter = (
  timeSinceRelease: number,
  turbulenceSeed: number,
): SparkFlutterForces => {
  const phase = timeSinceRelease + turbulenceSeed * 0.027;
  const zigzag = phase * SPARK_ZIGZAG_FREQUENCY;

  return {
    forceX:
      Math.sin(zigzag * 1.62 + turbulenceSeed * 0.11) * 0.28 +
      Math.sin(zigzag * 2.24 + turbulenceSeed * 0.07) * 0.16,
    forceY:
      Math.cos(zigzag * 1.38 + turbulenceSeed * 0.13) * 0.1 +
      Math.sin(zigzag * 1.94) * 0.06,
  };
};
