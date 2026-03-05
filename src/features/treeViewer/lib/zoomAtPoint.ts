import { MAX_ZOOM, MIN_ZOOM } from "../model/editorConstants";

export type ViewTransform = {
  offsetX: number;
  offsetY: number;
  scale: number;
};

/**
 * Computes new view transform when zooming at a point (keeps content under
 * the point fixed). Pure function for reuse in pan/zoom logic.
 */
export function computeZoomAtPoint(
  current: ViewTransform,
  clientX: number,
  clientY: number,
  containerLeft: number,
  containerTop: number,
  newScale: number,
): ViewTransform {
  const clampedScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newScale));
  const contentX = (clientX - containerLeft - current.offsetX) / current.scale;
  const contentY = (clientY - containerTop - current.offsetY) / current.scale;
  return {
    offsetX: clientX - containerLeft - contentX * clampedScale,
    offsetY: clientY - containerTop - contentY * clampedScale,
    scale: clampedScale,
  };
}
