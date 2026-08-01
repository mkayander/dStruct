import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("#/shared/lib/prefersReducedMotion", () => ({
  prefersReducedMotion: () => false,
}));

vi.mock("#/shared/ui/effects/thanosDisintegrate/buildThanosCapture", () => ({
  buildThanosCapture: vi.fn(),
}));

const { buildThanosCapture } =
  await import("#/shared/ui/effects/thanosDisintegrate/buildThanosCapture");
const { runThanosDisintegrate } =
  await import("#/shared/ui/effects/thanosDisintegrate/runThanosDisintegrate");

const createParticle = () => ({
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
  rotation: 0,
  rotationSpeed: 0,
  drag: 0.96,
  fadeStart: 0.5,
  fadeDuration: 0.4,
  releaseTime: 0,
});

describe("runThanosDisintegrate", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("uses a pre-warmed capture snapshot when provided", async () => {
    const element = document.createElement("div");
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
    document.body.appendChild(element);

    const snapshot = {
      sourceCanvas: null,
      particles: [createParticle()],
      displayWidth: 120,
      displayHeight: 48,
    };

    await expect(
      runThanosDisintegrate(element, { captureSnapshot: snapshot }),
    ).resolves.toBeUndefined();
    expect(buildThanosCapture).not.toHaveBeenCalled();
  });

  it("builds a fast capture when no snapshot is available", async () => {
    const element = document.createElement("div");
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
    document.body.appendChild(element);

    vi.mocked(buildThanosCapture).mockResolvedValue({
      sourceCanvas: null,
      particles: [createParticle()],
      displayWidth: 120,
      displayHeight: 48,
    });

    await expect(runThanosDisintegrate(element)).resolves.toBeUndefined();
    expect(buildThanosCapture).toHaveBeenCalledWith(element, {
      mode: "fast",
      disintegrateOptions: expect.any(Object),
    });
  });
});
