import { prefersReducedMotion } from "#/shared/lib/prefersReducedMotion";
import { captureElementToCanvas } from "#/shared/ui/effects/thanosDisintegrate/captureElementToCanvas";
import { THANOS_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/thanosDisintegrate/constants";
import { createParticlesFromImageData } from "#/shared/ui/effects/thanosDisintegrate/createParticlesFromImageData";
import type {
  ThanosDisintegrateOptions,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";

const resolveOptions = (
  options?: ThanosDisintegrateOptions,
): Required<ThanosDisintegrateOptions> => ({
  ...THANOS_DISINTEGRATE_DEFAULTS,
  ...options,
});

const stepParticles = (
  particles: ThanosParticle[],
  options: Required<ThanosDisintegrateOptions>,
): number => {
  let aliveCount = 0;

  for (const particle of particles) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += options.gravity;
    particle.vx += options.windX * 0.02;
    particle.vy += options.windY * 0.02;
    particle.alpha -= particle.decay;

    if (particle.alpha > 0) {
      aliveCount += 1;
    }
  }

  return aliveCount;
};

const drawParticles = (
  context: CanvasRenderingContext2D,
  particles: ThanosParticle[],
): void => {
  for (const particle of particles) {
    if (particle.alpha <= 0) {
      continue;
    }

    context.globalAlpha = particle.alpha;
    context.fillStyle = particle.color;
    context.fillRect(particle.x, particle.y, particle.size, particle.size);
  }

  context.globalAlpha = 1;
};

/**
 * Plays a Thanos-style particle disintegration on a DOM surface, then resolves.
 * No-ops when reduced motion is preferred or capture fails.
 */
export const runThanosDisintegrate = async (
  element: HTMLElement,
  options?: ThanosDisintegrateOptions,
): Promise<void> => {
  if (prefersReducedMotion()) {
    return;
  }

  const resolvedOptions = resolveOptions(options);
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return;
  }

  let sourceCanvas: HTMLCanvasElement;
  try {
    sourceCanvas = await captureElementToCanvas(element);
  } catch {
    return;
  }

  const width = Math.round(rect.width);
  const height = Math.round(rect.height);
  const context = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return;
  }

  const imageData = context.getImageData(0, 0, width, height);
  const particles = createParticlesFromImageData(imageData, resolvedOptions);
  if (particles.length === 0) {
    return;
  }

  const overlayCanvas = document.createElement("canvas");
  overlayCanvas.width = width;
  overlayCanvas.height = height;
  overlayCanvas.style.position = "fixed";
  overlayCanvas.style.left = `${rect.left}px`;
  overlayCanvas.style.top = `${rect.top}px`;
  overlayCanvas.style.width = `${width}px`;
  overlayCanvas.style.height = `${height}px`;
  overlayCanvas.style.pointerEvents = "none";
  overlayCanvas.style.zIndex = String(resolvedOptions.zIndex);

  const overlayContext = overlayCanvas.getContext("2d");
  if (!overlayContext) {
    return;
  }
  element.style.visibility = "hidden";
  document.body.appendChild(overlayCanvas);

  await new Promise<void>((resolve) => {
    let frame = 0;

    const animate = () => {
      overlayContext.clearRect(0, 0, width, height);
      const aliveCount = stepParticles(particles, resolvedOptions);
      drawParticles(overlayContext, particles);

      frame += 1;
      if (aliveCount === 0 || frame >= resolvedOptions.maxFrames) {
        overlayCanvas.remove();
        resolve();
        return;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  });
};
