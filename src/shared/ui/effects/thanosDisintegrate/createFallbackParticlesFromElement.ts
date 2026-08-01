import { THANOS_DISINTEGRATE_DEFAULTS } from "#/shared/ui/effects/thanosDisintegrate/constants";
import {
  parseCssColor,
  type RgbaColor,
  rgbaToCss,
} from "#/shared/ui/effects/thanosDisintegrate/parseCssColor";
import type {
  ThanosDisintegrateOptions,
  ThanosParticle,
} from "#/shared/ui/effects/thanosDisintegrate/types";

type RelativeRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const resolveOptions = (
  options?: ThanosDisintegrateOptions,
): Required<ThanosDisintegrateOptions> => ({
  ...THANOS_DISINTEGRATE_DEFAULTS,
  ...options,
});

const getRelativeRect = (
  child: Element,
  root: HTMLElement,
): RelativeRect | null => {
  const childRect = child.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  const width = childRect.width;
  const height = childRect.height;
  if (width <= 0 || height <= 0) {
    return null;
  }

  return {
    left: childRect.left - rootRect.left,
    top: childRect.top - rootRect.top,
    width,
    height,
  };
};

const createParticle = (
  x: number,
  y: number,
  color: RgbaColor,
  options: Required<ThanosDisintegrateOptions>,
): ThanosParticle => ({
  x,
  y,
  vx: (Math.random() - 0.35) * options.maxVelocity + options.windX,
  vy: (Math.random() - 0.55) * options.maxVelocity + options.windY,
  color: rgbaToCss(color),
  alpha: color.alpha,
  size: options.particleSize + Math.random(),
  decay: 0.012 + Math.random() * 0.02,
});

const addParticlesForRect = (
  particles: ThanosParticle[],
  rect: RelativeRect,
  color: RgbaColor,
  options: Required<ThanosDisintegrateOptions>,
): void => {
  const { particleStep } = options;
  const startX = Math.max(0, Math.floor(rect.left));
  const startY = Math.max(0, Math.floor(rect.top));
  const endX = Math.ceil(rect.left + rect.width);
  const endY = Math.ceil(rect.top + rect.height);

  for (let y = startY; y < endY; y += particleStep) {
    for (let x = startX; x < endX; x += particleStep) {
      particles.push(createParticle(x, y, color, options));
    }
  }
};

const collectSampleColors = (element: HTMLElement): RgbaColor[] => {
  const colors: RgbaColor[] = [];
  const nodes: Element[] = [element, ...element.querySelectorAll("*")];

  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) {
      continue;
    }

    const style = window.getComputedStyle(node);
    const candidates = [
      style.backgroundColor,
      style.color,
      style.borderTopColor,
    ];

    for (const candidate of candidates) {
      const parsed = parseCssColor(candidate);
      if (parsed) {
        colors.push(parsed);
      }
    }
  }

  return colors;
};

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

  const particles: ThanosParticle[] = [];
  const nodes: Element[] = [element, ...element.querySelectorAll("*")];

  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) {
      continue;
    }

    const style = window.getComputedStyle(node);
    const background = parseCssColor(style.backgroundColor);
    if (!background) {
      continue;
    }

    const rect = getRelativeRect(node, element);
    if (!rect) {
      continue;
    }

    addParticlesForRect(particles, rect, background, resolvedOptions);
  }

  if (particles.length > 0) {
    return particles;
  }

  const sampleColors = collectSampleColors(element);
  const fallbackColor = sampleColors[0] ?? {
    red: 180,
    green: 180,
    blue: 180,
    alpha: 0.85,
  };

  addParticlesForRect(
    particles,
    { left: 0, top: 0, width, height },
    fallbackColor,
    resolvedOptions,
  );

  return particles;
};
