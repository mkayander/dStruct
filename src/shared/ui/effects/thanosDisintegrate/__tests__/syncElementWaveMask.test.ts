import { afterEach, describe, expect, it } from "vitest";

import {
  applyParticleWaveMaskToCanvas,
  applyWaveMaskToElement,
  clearParticleWaveMaskFromCanvas,
  clearWaveMaskFromElement,
  createModalWaveMask,
  createParticleWaveMask,
  getWaveMaskRadii,
} from "#/shared/ui/effects/thanosDisintegrate/syncElementWaveMask";

describe("syncElementWaveMask", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("uses inverse gradients for modal and particle masks", () => {
    const radii = getWaveMaskRadii(0.5, 520);
    const origin = { x: 40, y: 20 };

    expect(createModalWaveMask(origin, radii)).toContain(
      "transparent 236px, black 284px",
    );
    expect(createParticleWaveMask(origin, radii)).toContain(
      "black 236px, transparent 284px",
    );
  });

  it("applies a radial css mask that expands with elapsed time", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    applyWaveMaskToElement(element, { x: 40, y: 20 }, 0.5, 520, 200, 80);

    expect(element.style.maskImage).toContain("radial-gradient");
    expect(element.style.maskImage).toContain("40px 20px");
    expect(element.style.maskSize).toBe("200px 80px");
  });

  it("applies the opposing mask to the particle canvas", () => {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    applyParticleWaveMaskToCanvas(canvas, { x: 10, y: 10 }, 0.25, 520, 120, 60);

    expect(canvas.style.maskImage).toContain("black");
    expect(canvas.style.maskImage).toContain("transparent");
    expect(canvas.style.maskSize).toBe("120px 60px");
  });

  it("offsets the particle mask origin when the canvas has bleed padding", () => {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    applyParticleWaveMaskToCanvas(
      canvas,
      { x: 10, y: 10 },
      0.25,
      520,
      160,
      100,
      20,
    );

    expect(canvas.style.maskImage).toContain("30px 30px");
    expect(canvas.style.maskSize).toBe("160px 100px");
  });

  it("clears mask styles on cleanup", () => {
    const element = document.createElement("div");
    const canvas = document.createElement("canvas");
    applyWaveMaskToElement(element, { x: 0, y: 0 }, 1, 520, 100, 50);
    applyParticleWaveMaskToCanvas(canvas, { x: 0, y: 0 }, 1, 520, 100, 50);

    clearWaveMaskFromElement(element);
    clearParticleWaveMaskFromCanvas(canvas);

    expect(element.style.maskImage).toBe("");
    expect(canvas.style.maskImage).toBe("");
  });
});
