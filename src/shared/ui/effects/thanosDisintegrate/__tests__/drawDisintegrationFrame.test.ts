import { describe, expect, it, vi } from "vitest";

import { drawDisintegrationFrame } from "#/shared/ui/effects/thanosDisintegrate/drawDisintegrationFrame";
import type { ThanosParticle } from "#/shared/ui/effects/thanosDisintegrate/types";

const createParticle = (
  overrides: Partial<ThanosParticle> = {},
): ThanosParticle => ({
  x: 0,
  y: 0,
  originX: 0,
  originY: 0,
  vx: 0,
  vy: 0,
  color: "rgb(255, 0, 0)",
  alpha: 1,
  baseAlpha: 1,
  size: 2,
  rotation: 0,
  rotationSpeed: 0,
  drag: 0.96,
  fadeStart: 0.5,
  fadeDuration: 0.4,
  releaseTime: 0,
  ...overrides,
});

describe("drawDisintegrationFrame", () => {
  it("keeps unreleased fallback pixels visible until the wave reaches them", () => {
    const fillRect = vi.fn();
    const context = {
      clearRect: vi.fn(),
      fillRect,
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      globalAlpha: 1,
      filter: "none",
    } as unknown as CanvasRenderingContext2D;

    const particles = [
      createParticle({ originX: 0, originY: 0, releaseTime: 0.5 }),
      createParticle({ originX: 3, originY: 0, releaseTime: 0, x: 1, y: 1 }),
    ];

    drawDisintegrationFrame(context, particles, 0, null, 6, 6, {
      particleStep: 3,
      snapshotBlur: 0,
    });

    expect(fillRect).toHaveBeenCalledWith(0, 0, 2, 2);
    expect(fillRect).not.toHaveBeenCalledWith(3, 0, 2, 2);
  });

  it("punches holes in a captured snapshot as particles release", () => {
    const sourceCanvas = document.createElement("canvas");
    const clearRect = vi.fn();
    const drawImage = vi.fn();
    const context = {
      clearRect,
      drawImage,
      fillRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      globalAlpha: 1,
      filter: "none",
    } as unknown as CanvasRenderingContext2D;

    const particles = [
      createParticle({ originX: 0, originY: 0, releaseTime: 0, x: 1, y: 1 }),
      createParticle({ originX: 3, originY: 0, releaseTime: 0.5 }),
    ];

    drawDisintegrationFrame(context, particles, 0.1, sourceCanvas, 6, 6, {
      particleStep: 3,
      snapshotBlur: 0.6,
    });

    expect(drawImage).toHaveBeenCalledWith(sourceCanvas, 0, 0, 6, 6);
    expect(context.filter).toBe("none");
    expect(clearRect).toHaveBeenCalledWith(0, 0, 3, 3);
    expect(clearRect).not.toHaveBeenCalledWith(3, 0, 3, 3);
  });
});
