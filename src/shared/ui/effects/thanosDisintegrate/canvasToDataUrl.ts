const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to read mask blob as data URL"));
    };
    reader.onerror = () => {
      reject(reader.error ?? new Error("Failed to read mask blob"));
    };
    reader.readAsDataURL(blob);
  });

type MaskCanvas = HTMLCanvasElement | OffscreenCanvas;

const isOffscreenCanvas = (canvas: MaskCanvas): canvas is OffscreenCanvas =>
  typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas;

/** Serializes a canvas mask to a PNG data URL on main thread or in a worker. */
export const canvasToDataUrl = async (canvas: MaskCanvas): Promise<string> => {
  if (isOffscreenCanvas(canvas)) {
    const blob = await canvas.convertToBlob({ type: "image/png" });
    return blobToDataUrl(blob);
  }

  return canvas.toDataURL("image/png");
};
