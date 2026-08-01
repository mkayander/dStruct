/** Downscales a capture bitmap to CSS pixel dimensions for 1:1 overlay alignment. */
export const normalizeCaptureToDisplay = (
  source: HTMLCanvasElement,
  displayWidth: number,
  displayHeight: number,
): HTMLCanvasElement => {
  if (source.width === displayWidth && source.height === displayHeight) {
    return source;
  }

  const normalized = document.createElement("canvas");
  normalized.width = displayWidth;
  normalized.height = displayHeight;

  const context = normalized.getContext("2d");
  if (!context) {
    return source;
  }

  context.drawImage(source, 0, 0, displayWidth, displayHeight);
  return normalized;
};
