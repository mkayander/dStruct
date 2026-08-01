/** Waits for web fonts so captures match the painted live surface. */
export const waitForDocumentFonts = async (): Promise<void> => {
  if (typeof document === "undefined" || !document.fonts?.ready) {
    return;
  }

  if (document.fonts.status === "loaded") {
    return;
  }

  await document.fonts.ready;
};
