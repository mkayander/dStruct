/** Radial CSS mask that reveals particles beneath the live surface as the wave expands. */
export const WAVE_MASK_FADE_PX = 24;

export const applyWaveMaskToElement = (
  element: HTMLElement,
  origin: { x: number; y: number },
  elapsedSeconds: number,
  waveSpeedPxPerSecond: number,
  displayWidth: number,
  displayHeight: number,
): void => {
  const waveRadius = elapsedSeconds * waveSpeedPxPerSecond;
  const innerRadius = Math.max(0, waveRadius - WAVE_MASK_FADE_PX);
  const outerRadius = waveRadius + WAVE_MASK_FADE_PX;
  const mask = `radial-gradient(circle at ${origin.x}px ${origin.y}px, transparent ${innerRadius}px, black ${outerRadius}px)`;
  const maskSize = `${displayWidth}px ${displayHeight}px`;

  element.style.maskImage = mask;
  element.style.maskSize = maskSize;
  element.style.setProperty("-webkit-mask-image", mask);
  element.style.setProperty("-webkit-mask-size", maskSize);
};

export const clearWaveMaskFromElement = (element: HTMLElement): void => {
  element.style.maskImage = "";
  element.style.maskSize = "";
  element.style.removeProperty("-webkit-mask-image");
  element.style.removeProperty("-webkit-mask-size");
};
