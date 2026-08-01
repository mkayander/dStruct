export { applyWaveOrigin } from "#/shared/ui/effects/thanosDisintegrate/applyWaveOrigin";
export {
  assignParticleReleaseTimes,
  resolveEffectiveMaskStrategy,
} from "#/shared/ui/effects/thanosDisintegrate/assignParticleReleaseTimes";
export {
  buildChunkMaskSequenceAsync,
  prewarmChunkMaskWorker,
} from "#/shared/ui/effects/thanosDisintegrate/buildChunkMaskSequenceAsync";
export { THANOS_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/thanosDisintegrate/constants";
export { createFallbackParticlesFromElement } from "#/shared/ui/effects/thanosDisintegrate/createFallbackParticlesFromElement";
export { createParticlesFromImageData } from "#/shared/ui/effects/thanosDisintegrate/createParticlesFromImageData";
export { MASK_STRATEGY_GENERATORS } from "#/shared/ui/effects/thanosDisintegrate/maskStrategies";
export { resolveRelativeOrigin } from "#/shared/ui/effects/thanosDisintegrate/resolveRelativeOrigin";
export { resolveThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/resolveThanosDisintegrateOptions";
export { runThanosDisintegrate } from "#/shared/ui/effects/thanosDisintegrate/runThanosDisintegrate";
export {
  ThanosDisintegrateError,
  type ThanosDisintegrateErrorCode,
} from "#/shared/ui/effects/thanosDisintegrate/thanosDisintegrateError";
export { scaleParticleCoordinates } from "#/shared/ui/effects/thanosDisintegrate/scaleParticleCoordinates";
export { useThanosDisintegrate } from "#/shared/ui/effects/thanosDisintegrate/useThanosDisintegrate";
export type {
  ThanosDisintegrateOptions,
  ThanosDisintegrateOrigin,
  ThanosDisintegrateMaskMode,
  ThanosMaskStrategy,
  ThanosParticleRenderMode,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";
