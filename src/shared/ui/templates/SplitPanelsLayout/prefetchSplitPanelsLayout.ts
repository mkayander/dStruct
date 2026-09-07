function loadSplitPanelsLayoutModule() {
  return import("./SplitPanelsLayout");
}

let splitPanelsLayoutPromise: ReturnType<
  typeof loadSplitPanelsLayoutModule
> | null = null;

/** Warm the client-only split layout chunk (idempotent). */
export const prefetchSplitPanelsLayout = (): ReturnType<
  typeof loadSplitPanelsLayoutModule
> => {
  splitPanelsLayoutPromise ??= loadSplitPanelsLayoutModule();
  return splitPanelsLayoutPromise;
};
