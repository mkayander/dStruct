import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("#/shared/lib/prefersReducedMotion", () => ({
  prefersReducedMotion: () => false,
}));

vi.mock(
  "#/shared/ui/effects/thanosDisintegrate/captureElementToCanvas",
  () => ({
    captureElementToCanvas: vi.fn(),
  }),
);

vi.mock(
  "#/shared/ui/effects/thanosDisintegrate/createFallbackParticlesFromElement",
  () => ({
    createFallbackParticlesFromElement: vi.fn(() => [
      {
        x: 0,
        y: 0,
        originX: 0,
        originY: 0,
        vx: 0,
        vy: 0,
        color: "rgb(100, 120, 140)",
        alpha: 1,
        baseAlpha: 1,
        size: 2,
        decay: 0.02,
        releaseFrame: 0,
      },
    ]),
  }),
);

const { captureElementToCanvas } =
  await import("#/shared/ui/effects/thanosDisintegrate/captureElementToCanvas");
const { createFallbackParticlesFromElement } =
  await import("#/shared/ui/effects/thanosDisintegrate/createFallbackParticlesFromElement");
const { runThanosDisintegrate } =
  await import("#/shared/ui/effects/thanosDisintegrate/runThanosDisintegrate");

describe("runThanosDisintegrate", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("uses fallback particles when canvas pixel reads are blocked", async () => {
    const element = document.createElement("div");
    element.style.width = "120px";
    element.style.height = "48px";
    element.getBoundingClientRect = () =>
      ({
        left: 10,
        top: 20,
        width: 120,
        height: 48,
        right: 130,
        bottom: 68,
        x: 10,
        y: 20,
        toJSON: () => ({}),
      }) as DOMRect;

    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 48;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("2d context unavailable in test");
    }
    vi.spyOn(context, "getImageData").mockImplementation(() => {
      throw new DOMException(
        "The canvas has been tainted by cross-origin data.",
        "SecurityError",
      );
    });

    vi.mocked(captureElementToCanvas).mockResolvedValue(canvas);
    document.body.appendChild(element);

    await expect(runThanosDisintegrate(element)).resolves.toBeUndefined();
    expect(createFallbackParticlesFromElement).toHaveBeenCalledWith(
      element,
      expect.any(Object),
    );
  });
});
