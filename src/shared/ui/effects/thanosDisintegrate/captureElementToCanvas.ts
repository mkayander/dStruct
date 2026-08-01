import { copyInlineStyles } from "#/shared/ui/effects/thanosDisintegrate/copyInlineStyles";

const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Failed to decode captured surface"));
    image.src = url;
  });

/** Renders an element subtree into a canvas via SVG foreignObject. */
export const captureElementToCanvas = async (
  element: HTMLElement,
): Promise<HTMLCanvasElement> => {
  const rect = element.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));

  const clone = element.cloneNode(true) as HTMLElement;
  copyInlineStyles(element, clone);
  const computed = window.getComputedStyle(element);
  clone.style.margin = "0";
  clone.style.position = "relative";
  clone.style.transform = "none";
  clone.style.backdropFilter = "none";
  clone.style.webkitBackdropFilter = "none";
  clone.style.backgroundColor = computed.backgroundColor;
  clone.style.color = computed.color;
  clone.style.border = computed.border;
  clone.style.borderRadius = computed.borderRadius;
  clone.style.boxShadow = computed.boxShadow;

  const svgMarkup = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;overflow:hidden;">
      ${clone.outerHTML}
    </div>
  </foreignObject>
</svg>`;

  const svgBlob = new Blob([svgMarkup], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      throw new Error("2d canvas context unavailable");
    }

    context.drawImage(image, 0, 0, width, height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
};
