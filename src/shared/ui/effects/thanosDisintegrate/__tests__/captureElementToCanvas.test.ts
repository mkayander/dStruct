import { afterEach, describe, expect, it, vi } from "vitest";

import { captureElementToCanvas } from "#/shared/ui/effects/thanosDisintegrate/captureElementToCanvas";
import { captureElementViaSnapdom } from "#/shared/ui/effects/thanosDisintegrate/captureElementViaSnapdom";

vi.mock(
  "#/shared/ui/effects/thanosDisintegrate/captureElementViaSnapdom",
  () => ({
    captureElementViaSnapdom: vi.fn(),
  }),
);

describe("captureElementToCanvas", () => {
  const originalImage = globalThis.Image;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  afterEach(() => {
    globalThis.Image = originalImage;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("prefers SnapDOM when capture succeeds", async () => {
    const element = document.createElement("div");
    const snapdomCanvas = document.createElement("canvas");
    snapdomCanvas.width = 160;
    snapdomCanvas.height = 64;

    vi.mocked(captureElementViaSnapdom).mockResolvedValue(snapdomCanvas);

    const canvas = await captureElementToCanvas(element);

    expect(canvas).toBe(snapdomCanvas);
    expect(captureElementViaSnapdom).toHaveBeenCalledWith(element);
  });

  it("falls back to SVG rasterization when SnapDOM fails", async () => {
    const element = document.createElement("div");
    element.style.backgroundColor = "rgba(255, 255, 255, 0.55)";
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

    vi.mocked(captureElementViaSnapdom).mockRejectedValue(
      new Error("snapdom unavailable"),
    );

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
    vi.spyOn(
      CanvasRenderingContext2D.prototype,
      "drawImage",
    ).mockImplementation(() => undefined);

    const canvas = await captureElementToCanvas(element);

    expect(canvas.width).toBe(160);
    expect(canvas.height).toBe(64);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock");
  });

  it("throws when both capture strategies fail", async () => {
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

    vi.mocked(captureElementViaSnapdom).mockRejectedValue(
      new Error("snapdom unavailable"),
    );

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
