import type { ChunkMaskSequence } from "#/shared/ui/effects/thanosDisintegrate/createChunkMaskSequence";
import { getChunkMaskIndex } from "#/shared/ui/effects/thanosDisintegrate/createChunkMaskSequence";

const clearWaveMaskStyles = (target: HTMLElement): void => {
  target.style.maskImage = "";
  target.style.maskSize = "";
  target.style.maskRepeat = "";
  target.style.removeProperty("-webkit-mask-image");
  target.style.removeProperty("-webkit-mask-size");
  target.style.removeProperty("-webkit-mask-repeat");
};

const applyMaskImage = (
  target: HTMLElement,
  maskUrl: string,
  maskSize: string,
): void => {
  const maskValue = `url("${maskUrl}")`;
  target.style.maskImage = maskValue;
  target.style.maskSize = maskSize;
  target.style.maskRepeat = "no-repeat";
  target.style.imageRendering = "pixelated";
  target.style.setProperty("-webkit-mask-image", maskValue);
  target.style.setProperty("-webkit-mask-size", maskSize);
  target.style.setProperty("-webkit-mask-repeat", "no-repeat");
};

/** Applies the precomputed chunk masks for the current elapsed time. */
export const applyChunkMaskFrame = (
  element: HTMLElement,
  particleCanvas: HTMLCanvasElement,
  sequence: ChunkMaskSequence,
  elapsedSeconds: number,
): void => {
  const maskIndex = getChunkMaskIndex(sequence.timeThresholds, elapsedSeconds);
  const modalMaskUrl = sequence.modalMaskUrls[maskIndex];
  const particleMaskUrl = sequence.particleMaskUrls[maskIndex];

  if (!modalMaskUrl || !particleMaskUrl) {
    return;
  }

  applyMaskImage(element, modalMaskUrl, sequence.modalMaskSize);
  applyMaskImage(particleCanvas, particleMaskUrl, sequence.particleMaskSize);
};

export const clearChunkMaskFromElement = clearWaveMaskStyles;
export const clearChunkMaskFromCanvas = clearWaveMaskStyles;
