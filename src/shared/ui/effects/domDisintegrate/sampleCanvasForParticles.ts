import { createParticlesFromImageData } from "#/shared/ui/effects/domDisintegrate/createParticlesFromImageData";
import { resolveDomDisintegrateOptions } from "#/shared/ui/effects/domDisintegrate/resolveDomDisintegrateOptions";
import type {
  DisintegrateParticle,
  DomDisintegrateOptions,
} from "#/shared/ui/effects/domDisintegrate/types";

/**
 * Samples the canvas on a particle grid using a downscaled read so getImageData
 * touches one pixel per particle cell instead of the full surface.
 */
export const sampleCanvasForParticles = (
  canvas: HTMLCanvasElement,
  options?: DomDisintegrateOptions,
): DisintegrateParticle[] | null => {
  const resolvedOptions = resolveDomDisintegrateOptions(options);
  const { particleStep } = resolvedOptions;
  const sampleColumns = Math.max(1, Math.ceil(canvas.width / particleStep));
  const sampleRows = Math.max(1, Math.ceil(canvas.height / particleStep));

  if (
    sampleColumns === canvas.width &&
    sampleRows === canvas.height &&
    particleStep === 1
  ) {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      return null;
    }

    try {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const particles = createParticlesFromImageData(
        imageData,
        resolvedOptions,
      );
      return particles.length > 0 ? particles : null;
    } catch {
      return null;
    }
  }

  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = sampleColumns;
  sampleCanvas.height = sampleRows;

  const sampleContext = sampleCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!sampleContext) {
    return null;
  }

  try {
    sampleContext.drawImage(canvas, 0, 0, sampleColumns, sampleRows);
    const imageData = sampleContext.getImageData(
      0,
      0,
      sampleColumns,
      sampleRows,
    );
    const particles = createParticlesFromImageData(
      imageData,
      resolvedOptions,
      particleStep,
    );
    return particles.length > 0 ? particles : null;
  } catch {
    return null;
  }
};
