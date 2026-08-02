import { describe, expect, it, vi } from "vitest";

import { createTestDisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/__tests__/createTestDisintegrateParticle";
import { drawDisintegrationFrame } from "#/shared/ui/effects/domDisintegrate/drawDisintegrationFrame";

const createMockContext = (
  overrides: Partial<CanvasRenderingContext2D> = {},
): CanvasRenderingContext2D =>
  ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    drawImage: vi.fn(),
    setTransform: vi.fn(),
    resetTransform: vi.fn(),
    globalAlpha: 1,
    ...overrides,
  }) as unknown as CanvasRenderingContext2D;

describe("drawDisintegrationFrame", () => {
  it("draws only released flying particles beneath the live surface", () => {
    const fillRect = vi.fn();
    const context = createMockContext({ fillRect });

    const particles = [
      createTestDisintegrateParticle({ releaseTime: 0.5 }),
      createTestDisintegrateParticle({ releaseTime: 0.2, x: 1, y: 1 }),
    ];

    drawDisintegrationFrame(context, particles, 0, 6, 6);

    expect(fillRect).not.toHaveBeenCalled();
  });

  it("draws released particles after the wave reaches them", () => {
    const fillRect = vi.fn();
    const context = createMockContext({ fillRect });

    const particles = [
      createTestDisintegrateParticle({ releaseTime: 0, x: 1, y: 1 }),
    ];

    drawDisintegrationFrame(context, particles, 0.1, 6, 6);

    expect(fillRect).toHaveBeenCalled();
  });

  it("offsets drawing when the canvas has bleed padding", () => {
    const fillRect = vi.fn();
    const context = createMockContext({ fillRect });

    const particles = [
      createTestDisintegrateParticle({ releaseTime: 0, x: 4, y: 6, size: 2 }),
    ];

    drawDisintegrationFrame(context, particles, 0.1, 20, 20, 8);

    expect(fillRect).toHaveBeenCalledWith(12, 14, 2, 2);
  });

  it("draws snapshot sprites when sprite mode is enabled", () => {
    const drawImage = vi.fn();
    const setTransform = vi.fn();
    const context = createMockContext({ drawImage, setTransform });

    const sourceCanvas = document.createElement("canvas");
    const particles = [
      createTestDisintegrateParticle({
        releaseTime: 0,
        x: 2,
        y: 2,
        originX: 4,
        originY: 6,
        rotation: 0.4,
      }),
    ];

    drawDisintegrationFrame(context, particles, 0.1, 20, 20, 0, {
      renderMode: "sprite",
      sourceCanvas,
    });

    expect(drawImage).toHaveBeenCalled();
    expect(setTransform).toHaveBeenCalled();
    expect(context.fillRect).not.toHaveBeenCalled();
  });
});
