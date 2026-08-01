/** Radial CSS mask that reveals particles beneath the live surface as the wave expands. */
export const WAVE_MASK_FADE_PX = 24;

export type WaveMaskRadii = {
  innerRadius: number;
  outerRadius: number;
};

export const getWaveMaskRadii = (
  elapsedSeconds: number,
  waveSpeedPxPerSecond: number,
): WaveMaskRadii => {
  const waveRadius = elapsedSeconds * waveSpeedPxPerSecond;

  return {
    innerRadius: Math.max(0, waveRadius - WAVE_MASK_FADE_PX),
    outerRadius: waveRadius + WAVE_MASK_FADE_PX,
  };
};

/** Modal: transparent inside the wave (dissolved), opaque outside (glass remains). */
export const createModalWaveMask = (
  origin: { x: number; y: number },
  { innerRadius, outerRadius }: WaveMaskRadii,
): string =>
  `radial-gradient(circle at ${origin.x}px ${origin.y}px, transparent ${innerRadius}px, black ${outerRadius}px)`;

/** Particles: visible inside the wave, hidden outside (inverse of the modal mask). */
export const createParticleWaveMask = (
  origin: { x: number; y: number },
  { innerRadius, outerRadius }: WaveMaskRadii,
): string =>
  `radial-gradient(circle at ${origin.x}px ${origin.y}px, black ${innerRadius}px, transparent ${outerRadius}px)`;

const applyMaskStyles = (
  target: HTMLElement,
  mask: string,
  maskSize: string,
): void => {
  target.style.maskImage = mask;
  target.style.maskSize = maskSize;
  target.style.setProperty("-webkit-mask-image", mask);
  target.style.setProperty("-webkit-mask-size", maskSize);
};

export const applyWaveMaskToElement = (
  element: HTMLElement,
  origin: { x: number; y: number },
  elapsedSeconds: number,
  waveSpeedPxPerSecond: number,
  displayWidth: number,
  displayHeight: number,
): void => {
  const radii = getWaveMaskRadii(elapsedSeconds, waveSpeedPxPerSecond);
  const mask = createModalWaveMask(origin, radii);
  const maskSize = `${displayWidth}px ${displayHeight}px`;
  applyMaskStyles(element, mask, maskSize);
};

export const applyParticleWaveMaskToCanvas = (
  canvas: HTMLCanvasElement,
  origin: { x: number; y: number },
  elapsedSeconds: number,
  waveSpeedPxPerSecond: number,
  displayWidth: number,
  displayHeight: number,
): void => {
  const radii = getWaveMaskRadii(elapsedSeconds, waveSpeedPxPerSecond);
  const mask = createParticleWaveMask(origin, radii);
  const maskSize = `${displayWidth}px ${displayHeight}px`;
  applyMaskStyles(canvas, mask, maskSize);
};

export const clearWaveMaskFromElement = (element: HTMLElement): void => {
  element.style.maskImage = "";
  element.style.maskSize = "";
  element.style.removeProperty("-webkit-mask-image");
  element.style.removeProperty("-webkit-mask-size");
};

export const clearParticleWaveMaskFromCanvas = (
  canvas: HTMLCanvasElement,
): void => {
  canvas.style.maskImage = "";
  canvas.style.maskSize = "";
  canvas.style.removeProperty("-webkit-mask-image");
  canvas.style.removeProperty("-webkit-mask-size");
};
