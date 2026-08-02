import { captureElementViaSnapdom } from "#/shared/ui/effects/domDisintegrate/captureElementViaSnapdom";
import { captureElementViaSvgForeignObject } from "#/shared/ui/effects/domDisintegrate/captureElementViaSvgForeignObject";
import { createFallbackParticlesFromElement } from "#/shared/ui/effects/domDisintegrate/createFallbackParticlesFromElement";
import type {
  BuildDisintegrateCaptureOptions,
  DisintegrateCaptureSnapshot,
} from "#/shared/ui/effects/domDisintegrate/disintegrateCaptureSnapshot";
import { getElementDisplaySize } from "#/shared/ui/effects/domDisintegrate/disintegrateCaptureSnapshot";
import { normalizeCaptureToDisplay } from "#/shared/ui/effects/domDisintegrate/normalizeCaptureToDisplay";
import { sampleCanvasForParticles } from "#/shared/ui/effects/domDisintegrate/sampleCanvasForParticles";
import { waitForDocumentFonts } from "#/shared/ui/effects/domDisintegrate/waitForDocumentFonts";

/** Builds particles + optional snapshot canvas for the disintegration effect. */
export const buildDisintegrateCapture = async (
  element: HTMLElement,
  { mode, disintegrateOptions }: BuildDisintegrateCaptureOptions,
): Promise<DisintegrateCaptureSnapshot> => {
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
    particles = sampleCanvasForParticles(sourceCanvas, disintegrateOptions);
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
