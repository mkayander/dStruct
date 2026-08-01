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
      createParticle({ releaseTime: 0.5 }),
      createParticle({ releaseTime: 0.2, x: 1, y: 1 }),
    ];

    drawDisintegrationFrame(context, particles, 0, 6, 6);

    expect(fillRect).not.toHaveBeenCalled();
  });

  it("draws released particles after the wave reaches them", () => {
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

    const particles = [createParticle({ releaseTime: 0, x: 1, y: 1 })];

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

    const particles = [createParticle({ releaseTime: 0, x: 4, y: 6, size: 2 })];

    drawDisintegrationFrame(context, particles, 0.1, 20, 20, 8);

    expect(translate).toHaveBeenCalledWith(4 + 8 + 1, 6 + 8 + 1);
  });
});
