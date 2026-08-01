import { describe, expect, it, vi } from "vitest";

import { createTestDisintegrateParticle } from "#/shared/ui/effects/domDisintegrate/__tests__/createTestDisintegrateParticle";
import { drawDisintegrationFrame } from "#/shared/ui/effects/domDisintegrate/drawDisintegrationFrame";

describe("drawDisintegrationFrame", () => {
  it("draws only released flying particles beneath the live surface", () => {
    const fillRect = vi.fn();
    const context = {
      clearRect: vi.fn(),
      fillRect,
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D;

    const particles = [
      createTestDisintegrateParticle({ releaseTime: 0.5 }),
      createTestDisintegrateParticle({ releaseTime: 0.2, x: 1, y: 1 }),
    ];

    drawDisintegrationFrame(context, particles, 0, 6, 6);

    expect(fillRect).not.toHaveBeenCalled();
  });

  it("draws released particles after the wave reaches them", () => {
    const fillRect = vi.fn();
    const context = {
      clearRect: vi.fn(),
      fillRect,
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D;

    const particles = [
      createTestDisintegrateParticle({ releaseTime: 0, x: 1, y: 1 }),
    ];

    drawDisintegrationFrame(context, particles, 0.1, 6, 6);

    expect(fillRect).toHaveBeenCalled();
  });

  it("offsets drawing when the canvas has bleed padding", () => {
    const translate = vi.fn();
    const context = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate,
      rotate: vi.fn(),
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D;

    const particles = [
      createTestDisintegrateParticle({ releaseTime: 0, x: 4, y: 6, size: 2 }),
    ];

    drawDisintegrationFrame(context, particles, 0.1, 20, 20, 8);

    expect(translate).toHaveBeenCalledWith(4 + 8 + 1, 6 + 8 + 1);
  });

  it("draws snapshot sprites when sprite mode is enabled", () => {
    const drawImage = vi.fn();
    const context = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      drawImage,
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D;

    const sourceCanvas = document.createElement("canvas");
    const particles = [
      createTestDisintegrateParticle({
        releaseTime: 0,
        x: 2,
        y: 2,
        originX: 4,
        originY: 6,
      }),
    ];

    drawDisintegrationFrame(context, particles, 0.1, 20, 20, 0, {
      renderMode: "sprite",
      sourceCanvas,
    });

    expect(drawImage).toHaveBeenCalled();
    expect(context.fillRect).not.toHaveBeenCalled();
  });
});
