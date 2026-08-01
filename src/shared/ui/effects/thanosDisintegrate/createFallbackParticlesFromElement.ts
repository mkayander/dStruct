import { createThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/createThanosParticle";
import {
  parseCssColor,
  type RgbaColor,
} from "#/shared/ui/effects/thanosDisintegrate/parseCssColor";
import { resolveThanosDisintegrateOptions } from "#/shared/ui/effects/thanosDisintegrate/resolveThanosDisintegrateOptions";
import { sampleColorAtLocalPoint } from "#/shared/ui/effects/thanosDisintegrate/sampleColorAtLocalPoint";
import type {
  ThanosDisintegrateOptions,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";

/** Builds particles from live DOM colors when raster capture is empty (e.g. glass blur). */
export const createFallbackParticlesFromElement = (
  element: HTMLElement,
  options?: ThanosDisintegrateOptions,
): ThanosParticle[] => {
  const resolvedOptions = resolveThanosDisintegrateOptions(options);
  const rootRect = element.getBoundingClientRect();
  const width = Math.round(rootRect.width);
  const height = Math.round(rootRect.height);
  if (width <= 0 || height <= 0) {
    return [];
  }

  const rootStyle = window.getComputedStyle(element);
  const defaultColor = parseCssColor(rootStyle.backgroundColor) ??
    parseCssColor(rootStyle.color) ?? {
      red: 180,
      green: 180,
      blue: 180,
      alpha: 0.85,
    };

  const particles: ThanosParticle[] = [];
  const { particleStep } = resolvedOptions;

  for (let y = 0; y < height; y += particleStep) {
    for (let x = 0; x < width; x += particleStep) {
      const sampleX = x + particleStep / 2;
      const sampleY = y + particleStep / 2;
      const color: RgbaColor =
        sampleColorAtLocalPoint(element, sampleX, sampleY) ?? defaultColor;
      particles.push(
        createThanosParticle({
          x,
          y,
          color: `rgb(${color.red}, ${color.green}, ${color.blue})`,
          alpha: color.alpha,
          surfaceWidth: width,
          surfaceHeight: height,
          options: resolvedOptions,
        }),
      );
    }
  }

  return particles;
};
