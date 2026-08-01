import { snapdom } from "@zumer/snapdom";

const getPageBackgroundColor = (): string | undefined => {
  const background = window.getComputedStyle(document.body).backgroundColor;
  if (
    background === "" ||
    background === "transparent" ||
    background === "rgba(0, 0, 0, 0)"
  ) {
    return undefined;
  }

  return background;
};

/** Captures an element with SnapDOM (backdrop-filter, pseudo-elements, fonts). */
export const captureElementViaSnapdom = async (
  element: HTMLElement,
): Promise<HTMLCanvasElement> => {
  const rect = element.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));

  return snapdom.toCanvas(element, {
    width,
    height,
    dpr: 1,
    backgroundColor: getPageBackgroundColor(),
    fast: true,
    embedFonts: false,
    outerShadows: false,
  });
};
