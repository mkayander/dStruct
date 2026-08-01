import { afterEach, describe, expect, it } from "vitest";

import {
  applyWaveMaskToElement,
  clearWaveMaskFromElement,
} from "#/shared/ui/effects/thanosDisintegrate/syncElementWaveMask";

describe("syncElementWaveMask", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("applies a radial css mask that expands with elapsed time", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    applyWaveMaskToElement(element, { x: 40, y: 20 }, 0.5, 520, 200, 80);

    expect(element.style.maskImage).toContain("radial-gradient");
    expect(element.style.maskImage).toContain("40px 20px");
    expect(element.style.maskSize).toBe("200px 80px");
  });

  it("clears mask styles on cleanup", () => {
    const element = document.createElement("div");
    applyWaveMaskToElement(element, { x: 0, y: 0 }, 1, 520, 100, 50);
    clearWaveMaskFromElement(element);

    expect(element.style.maskImage).toBe("");
    expect(element.style.maskSize).toBe("");
  });
});
