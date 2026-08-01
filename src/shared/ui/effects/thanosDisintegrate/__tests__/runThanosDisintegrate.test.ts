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
const { ThanosDisintegrateError } =
  await import("#/shared/ui/effects/thanosDisintegrate/thanosDisintegrateError");

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

  it("throws when capture produces no particles", async () => {
    vi.mocked(buildChunkMaskSequenceAsync).mockResolvedValue(null);
    vi.mocked(buildThanosCapture).mockResolvedValue({
      sourceCanvas: null,
      particles: [],
      displayWidth: 120,
      displayHeight: 48,
    });
    const element = createElement();

    await expect(
      runThanosDisintegrate(element, {
        origin: { x: 60, y: 24 },
      }),
    ).rejects.toBeInstanceOf(ThanosDisintegrateError);
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

  it("applies radial masks while chunk masks are building when origin is set", async () => {
    const syncElementWaveMask =
      await import("#/shared/ui/effects/thanosDisintegrate/syncElementWaveMask");
    const applyWaveMaskSpy = vi.spyOn(
      syncElementWaveMask,
      "applyWaveMaskToElement",
    );

    vi.mocked(buildChunkMaskSequenceAsync).mockReturnValue(
      new Promise(() => {}),
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
      maxDuration: 0.2,
    });

    for (let frameIndex = 0; frameIndex < 3; frameIndex += 1) {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }

    expect(applyWaveMaskSpy).toHaveBeenCalled();
    await animation;
    applyWaveMaskSpy.mockRestore();
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

  it("keeps radial masks when chunk sequence arrives after radial fallback started", async () => {
    const syncChunkMaskSequence =
      await import("#/shared/ui/effects/thanosDisintegrate/syncChunkMaskSequence");
    const syncElementWaveMask =
      await import("#/shared/ui/effects/thanosDisintegrate/syncElementWaveMask");
    const applyChunkMaskSpy = vi.spyOn(
      syncChunkMaskSequence,
      "applyChunkMaskFrame",
    );
    const applyWaveMaskSpy = vi.spyOn(
      syncElementWaveMask,
      "applyWaveMaskToElement",
    );
    const revoke = vi.fn();

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
      maxDuration: 0.25,
    });

    for (let frameIndex = 0; frameIndex < 3; frameIndex += 1) {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }

    expect(applyWaveMaskSpy).toHaveBeenCalled();
    expect(applyChunkMaskSpy).not.toHaveBeenCalled();

    resolveChunkMasks?.({
      timeThresholds: [0],
      modalMaskUrls: ["data:image/png;base64,modal"],
      particleMaskUrls: ["data:image/png;base64,particle"],
      modalMaskSize: "120px 48px",
      particleMaskSize: "200px 128px",
      revoke,
    });

    for (let frameIndex = 0; frameIndex < 3; frameIndex += 1) {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    }

    expect(applyChunkMaskSpy).not.toHaveBeenCalled();
    expect(revoke).toHaveBeenCalled();
    await animation;
    applyChunkMaskSpy.mockRestore();
    applyWaveMaskSpy.mockRestore();
  });
});
