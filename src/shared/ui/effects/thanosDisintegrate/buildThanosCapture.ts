import { captureElementViaSnapdom } from "#/shared/ui/effects/thanosDisintegrate/captureElementViaSnapdom";
import { captureElementViaSvgForeignObject } from "#/shared/ui/effects/thanosDisintegrate/captureElementViaSvgForeignObject";
import { createFallbackParticlesFromElement } from "#/shared/ui/effects/thanosDisintegrate/createFallbackParticlesFromElement";
import { createParticlesFromImageData } from "#/shared/ui/effects/thanosDisintegrate/createParticlesFromImageData";
import { normalizeCaptureToDisplay } from "#/shared/ui/effects/thanosDisintegrate/normalizeCaptureToDisplay";
import type {
  BuildThanosCaptureOptions,
  ThanosCaptureSnapshot,
} from "#/shared/ui/effects/thanosDisintegrate/thanosCaptureSnapshot";
import { getElementDisplaySize } from "#/shared/ui/effects/thanosDisintegrate/thanosCaptureSnapshot";
import { waitForDocumentFonts } from "#/shared/ui/effects/thanosDisintegrate/waitForDocumentFonts";

const tryCreateParticlesFromCanvas = (
  canvas: HTMLCanvasElement,
  disintegrateOptions?: BuildThanosCaptureOptions["disintegrateOptions"],
) => {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }

  try {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const particles = createParticlesFromImageData(
      imageData,
      disintegrateOptions,
    );
    return particles.length > 0 ? particles : null;
  } catch {
    return null;
  }
};

/** Builds particles + optional snapshot canvas for the disintegration effect. */
export const buildThanosCapture = async (
  element: HTMLElement,
  { mode, disintegrateOptions }: BuildThanosCaptureOptions,
): Promise<ThanosCaptureSnapshot> => {
  if (mode === "quality") {
    await waitForDocumentFonts();
  }

  const { displayWidth, displayHeight } = getElementDisplaySize(element);

  let rawCanvas: HTMLCanvasElement | null = null;
  try {
    rawCanvas =
      mode === "quality"
        ? await captureElementViaSnapdom(element)
        : await captureElementViaSvgForeignObject(element);
  } catch {
    rawCanvas = null;
  }

  let sourceCanvas: HTMLCanvasElement | null = null;
  let particles = null;

  if (rawCanvas) {
    sourceCanvas = normalizeCaptureToDisplay(
      rawCanvas,
      displayWidth,
      displayHeight,
    );
    particles = tryCreateParticlesFromCanvas(sourceCanvas, disintegrateOptions);
  }

  if (!particles) {
    sourceCanvas = null;
    particles = createFallbackParticlesFromElement(
      element,
      disintegrateOptions,
    );
  }

  return {
    sourceCanvas,
    particles,
    displayWidth,
    displayHeight,
  };
};
