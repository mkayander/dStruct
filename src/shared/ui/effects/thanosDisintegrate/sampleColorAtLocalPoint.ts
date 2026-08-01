import type { RgbaColor } from "#/shared/ui/effects/thanosDisintegrate/parseCssColor";
import { parseCssColor } from "#/shared/ui/effects/thanosDisintegrate/parseCssColor";

const getLuminance = (color: RgbaColor): number =>
  (0.299 * color.red + 0.587 * color.green + 0.114 * color.blue) / 255;

const isLightOpaqueBackground = (color: RgbaColor): boolean =>
  color.alpha > 0.35 && getLuminance(color) > 0.72;

const pickVisibleColor = (style: CSSStyleDeclaration): RgbaColor | null => {
  const background = parseCssColor(style.backgroundColor);
  const textColor = parseCssColor(style.color);
  const borderColor = parseCssColor(style.borderTopColor);

  if (background && !isLightOpaqueBackground(background)) {
    return background;
  }

  if (textColor) {
    return textColor;
  }

  if (borderColor) {
    return borderColor;
  }

  if (background) {
    return background;
  }

  return null;
};

/** Samples the topmost visible color inside `root` at a local coordinate. */
export const sampleColorAtLocalPoint = (
  root: HTMLElement,
  localX: number,
  localY: number,
): RgbaColor | null => {
  const rootRect = root.getBoundingClientRect();
  const clientX = rootRect.left + localX;
  const clientY = rootRect.top + localY;

  if (typeof document.elementsFromPoint === "function") {
    const stack = document.elementsFromPoint(clientX, clientY);
    for (const node of stack) {
      if (!(node instanceof HTMLElement) || !root.contains(node)) {
        continue;
      }

      const color = pickVisibleColor(window.getComputedStyle(node));
      if (color) {
        return color;
      }
    }
  }

  return pickVisibleColor(window.getComputedStyle(root));
};
