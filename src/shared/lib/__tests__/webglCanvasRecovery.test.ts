import { describe, expect, it, vi } from "vitest";

import {
  attachWebGLContextRecovery,
  disposeWebGLRenderer,
} from "#/shared/lib/webglCanvasRecovery";

describe("attachWebGLContextRecovery", () => {
  it("calls onContextLost when webglcontextlost fires", () => {
    const canvas = document.createElement("canvas");
    const onContextLost = vi.fn();

    attachWebGLContextRecovery(canvas, onContextLost);
    canvas.dispatchEvent(new Event("webglcontextlost"));

    expect(onContextLost).toHaveBeenCalledTimes(1);
  });

  it("detaches the listener when cleanup runs", () => {
    const canvas = document.createElement("canvas");
    const onContextLost = vi.fn();

    const detach = attachWebGLContextRecovery(canvas, onContextLost);
    detach();
    canvas.dispatchEvent(new Event("webglcontextlost"));

    expect(onContextLost).not.toHaveBeenCalled();
  });
});

describe("disposeWebGLRenderer", () => {
  it("swallows dispose errors from lost contexts", () => {
    expect(() =>
      disposeWebGLRenderer(() => {
        throw new Error("context lost");
      }),
    ).not.toThrow();
  });
});
