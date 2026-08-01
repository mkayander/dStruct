import { THANOS_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/thanosDisintegrate/constants";
import {
  parseCssColor,
  type RgbaColor,
  rgbaToCss,
} from "#/shared/ui/effects/thanosDisintegrate/parseCssColor";
import { sampleColorAtLocalPoint } from "#/shared/ui/effects/thanosDisintegrate/sampleColorAtLocalPoint";
import type {
  ThanosDisintegrateOptions,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";

type ResolvedThanosOptions = Required<
  Omit<ThanosDisintegrateOptions, "origin">
>;

const resolveOptions = (
  options?: ThanosDisintegrateOptions,
): ResolvedThanosOptions => ({
  ...THANOS_DISINTEGRATE_DEFAULTS,
  ...options,
});

const createParticle = (
  x: number,
  y: number,
  color: RgbaColor,
  options: ResolvedThanosOptions,
): ThanosParticle => ({
  x,
  y,
  vx: (Math.random() - 0.35) * options.maxVelocity + options.windX,
  vy: (Math.random() - 0.55) * options.maxVelocity + options.windY,
  color: rgbaToCss(color),
  alpha: color.alpha,
  baseAlpha: color.alpha,
  size: options.particleSize + Math.random(),
  decay: 0.012 + Math.random() * 0.02,
  releaseFrame: 0,
});

/** Builds particles from live DOM colors when raster capture is empty (e.g. glass blur). */
export const createFallbackParticlesFromElement = (
  element: HTMLElement,
  options?: ThanosDisintegrateOptions,
): ThanosParticle[] => {
  const resolvedOptions = resolveOptions(options);
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
      const color =
        sampleColorAtLocalPoint(element, sampleX, sampleY) ?? defaultColor;
      particles.push(createParticle(x, y, color, resolvedOptions));
    }
  }

  return particles;
};
