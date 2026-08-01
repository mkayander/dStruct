import { captureElementViaSnapdom } from "#/shared/ui/effects/thanosDisintegrate/captureElementViaSnapdom";
import { captureElementViaSvgForeignObject } from "#/shared/ui/effects/thanosDisintegrate/captureElementViaSvgForeignObject";

/** Captures a DOM surface to canvas; prefers SnapDOM, falls back to SVG foreignObject. */
export const captureElementToCanvas = async (
  element: HTMLElement,
): Promise<HTMLCanvasElement> => {
  try {
    return await captureElementViaSnapdom(element);
  } catch {
    return captureElementViaSvgForeignObject(element);
  }
};
