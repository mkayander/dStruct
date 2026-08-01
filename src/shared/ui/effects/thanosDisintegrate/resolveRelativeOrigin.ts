import type { ThanosDisintegrateOrigin } from "#/shared/ui/effects/thanosDisintegrate/types";

/** Converts a client or local origin into coordinates relative to `element`. */
export const resolveRelativeOrigin = (
  element: HTMLElement,
  origin?: ThanosDisintegrateOrigin,
): { x: number; y: number } | null => {
  if (!origin) {
    return null;
  }

  if ("x" in origin) {
    return origin;
  }

  const rect = element.getBoundingClientRect();
  return {
    x: origin.clientX - rect.left,
    y: origin.clientY - rect.top,
  };
};
