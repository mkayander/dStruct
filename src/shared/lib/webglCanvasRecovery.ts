/** Attach listeners that remount the canvas when the GPU reclaims the WebGL context. */
export function attachWebGLContextRecovery(
  canvas: HTMLCanvasElement,
  onContextLost: () => void,
): () => void {
  const handleContextLost = (event: Event) => {
    event.preventDefault();
    onContextLost();
  };

  canvas.addEventListener("webglcontextlost", handleContextLost);

  return () => {
    canvas.removeEventListener("webglcontextlost", handleContextLost);
  };
}

/** Best-effort renderer teardown when a decorative canvas unmounts. */
export function disposeWebGLRenderer(dispose: (() => void) | undefined): void {
  if (!dispose) {
    return;
  }

  try {
    dispose();
  } catch {
    // Context may already be lost during App Router navigations.
  }
}
