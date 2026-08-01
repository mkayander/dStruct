import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { captureElementToCanvas } from "#/shared/ui/effects/thanosDisintegrate/captureElementToCanvas";

describe("captureElementToCanvas", () => {
  const originalImage = globalThis.Image;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    window.getComputedStyle = vi.fn(
      () =>
        ({
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          color: "rgb(17, 24, 39)",
          border: "1px solid rgba(255, 255, 255, 0.35)",
          borderRadius: "8px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          length: 0,
          item: () => "",
          getPropertyValue: () => "",
          getPropertyPriority: () => "",
        }) as CSSStyleDeclaration,
    );
  });

  afterEach(() => {
    globalThis.Image = originalImage;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("returns a sized canvas when SVG rasterization succeeds", async () => {
    const element = document.createElement("div");
    element.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 160,
        height: 64,
        right: 160,
        bottom: 64,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    document.body.appendChild(element);

    URL.createObjectURL = vi.fn(() => "blob:mock");
    URL.revokeObjectURL = vi.fn();

    class MockImage {
      decoding = "async";
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      private _src = "";

      set src(value: string) {
        this._src = value;
        this.onload?.();
      }

      get src() {
        return this._src;
      }
    }

    globalThis.Image = MockImage as unknown as typeof Image;
    vi.spyOn(CanvasRenderingContext2D.prototype, "drawImage").mockImplementation(
      () => undefined,
    );

    const canvas = await captureElementToCanvas(element);

    expect(canvas.width).toBe(160);
    expect(canvas.height).toBe(64);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock");
  });

  it("throws when rasterization fails", async () => {
    const element = document.createElement("div");
    element.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 80,
        height: 40,
        right: 80,
        bottom: 40,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    URL.createObjectURL = vi.fn(() => "blob:mock");
    URL.revokeObjectURL = vi.fn();

    class FailingImage {
      decoding = "async";
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_value: string) {
        this.onerror?.();
      }
    }

    globalThis.Image = FailingImage as unknown as typeof Image;

    await expect(captureElementToCanvas(element)).rejects.toThrow(
      "Failed to rasterize captured surface",
    );
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock");
  });
});
