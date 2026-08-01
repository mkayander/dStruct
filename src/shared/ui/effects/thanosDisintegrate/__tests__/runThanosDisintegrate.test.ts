import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("#/shared/lib/prefersReducedMotion", () => ({
  prefersReducedMotion: () => false,
}));

vi.mock("#/shared/ui/effects/thanosDisintegrate/buildThanosCapture", () => ({
  buildThanosCapture: vi.fn(),
}));

vi.mock(
  "#/shared/ui/effects/thanosDisintegrate/buildChunkMaskSequenceAsync",
  () => ({
    buildChunkMaskSequenceAsync: vi.fn(),
  }),
);

const { buildThanosCapture } =
  await import("#/shared/ui/effects/thanosDisintegrate/buildThanosCapture");
const { buildChunkMaskSequenceAsync } =
  await import("#/shared/ui/effects/thanosDisintegrate/buildChunkMaskSequenceAsync");
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

const createElement = () => {
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
  return element;
};

describe("runThanosDisintegrate", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.clearAllMocks();
  });

  it("uses a pre-warmed capture snapshot when provided", async () => {
    vi.mocked(buildChunkMaskSequenceAsync).mockResolvedValue(null);
    const element = createElement();
    const snapshot = {
      sourceCanvas: null,
      particles: [createParticle()],
      displayWidth: 120,
      displayHeight: 48,
    };

    await expect(
      runThanosDisintegrate(element, {
        captureSnapshot: snapshot,
        origin: { x: 60, y: 24 },
      }),
    ).resolves.toBeUndefined();
    expect(buildThanosCapture).not.toHaveBeenCalled();
  });

  it("builds a fast capture when no snapshot is available", async () => {
    vi.mocked(buildChunkMaskSequenceAsync).mockResolvedValue(null);
    const element = createElement();

    vi.mocked(buildThanosCapture).mockResolvedValue({
      sourceCanvas: null,
      particles: [createParticle()],
      displayWidth: 120,
      displayHeight: 48,
    });

    await expect(
      runThanosDisintegrate(element, { origin: { x: 60, y: 24 } }),
    ).resolves.toBeUndefined();
    expect(buildThanosCapture).toHaveBeenCalledWith(element, {
      mode: "fast",
      disintegrateOptions: expect.any(Object),
    });
  });

  it("falls back to radial masks when chunk mask generation is unavailable", async () => {
    vi.mocked(buildChunkMaskSequenceAsync).mockResolvedValue(null);
    const element = createElement();
    const snapshot = {
      sourceCanvas: null,
      particles: [createParticle()],
      displayWidth: 120,
      displayHeight: 48,
    };

    await expect(
      runThanosDisintegrate(element, {
        captureSnapshot: snapshot,
        origin: { x: 60, y: 24 },
        maskMode: "chunks",
      }),
    ).resolves.toBeUndefined();

    expect(buildChunkMaskSequenceAsync).toHaveBeenCalled();
  });

  it("starts animating before chunk masks finish building", async () => {
    let resolveChunkMasks:
      | ((
          value: Awaited<ReturnType<typeof buildChunkMaskSequenceAsync>>,
        ) => void)
      | undefined;
    vi.mocked(buildChunkMaskSequenceAsync).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveChunkMasks = resolve;
        }),
    );

    const element = createElement();
    const snapshot = {
      sourceCanvas: null,
      particles: [createParticle()],
      displayWidth: 120,
      displayHeight: 48,
    };

    const animation = runThanosDisintegrate(element, {
      captureSnapshot: snapshot,
      origin: { x: 60, y: 24 },
      maskMode: "chunks",
      maxDuration: 0.05,
    });

    await Promise.resolve();
    expect(buildChunkMaskSequenceAsync).toHaveBeenCalled();

    resolveChunkMasks?.(null);
    await expect(animation).resolves.toBeUndefined();
  });
});
