import { afterEach, describe, expect, it, vi } from "vitest";

import { prepareCaptureClone } from "#/shared/ui/effects/domDisintegrate/prepareCaptureClone";

const createStyledElement = (): HTMLDivElement => {
  const element = document.createElement("div");
  element.style.backgroundColor = "rgba(255, 255, 255, 0.55)";
  element.style.color = "rgb(17, 24, 39)";
  element.style.border = "1px solid rgba(255, 255, 255, 0.35)";
  element.style.borderRadius = "8px";
  element.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.08)";
  document.body.appendChild(element);
  return element;
};

describe("prepareCaptureClone", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("strips backdrop filters using setProperty for the webkit variant", () => {
    const element = createStyledElement();
    element.style.backdropFilter = "blur(20px) saturate(180%)";
    element.style.setProperty(
      "-webkit-backdrop-filter",
      "blur(20px) saturate(180%)",
    );

    const setPropertySpy = vi.spyOn(
      CSSStyleDeclaration.prototype,
      "setProperty",
    );
    const clone = prepareCaptureClone(element);

    expect(clone.style.backdropFilter).toBe("none");
    expect(setPropertySpy).toHaveBeenCalledWith(
      "-webkit-backdrop-filter",
      "none",
    );
  });

  it("copies computed raster-friendly styles onto the clone", () => {
    const element = createStyledElement();
    const clone = prepareCaptureClone(element);

    expect(clone.style.backgroundColor).toBe("rgba(255, 255, 255, 0.55)");
    expect(clone.style.color).toBe("rgb(17, 24, 39)");
    expect(clone.style.border).toBe("1px solid rgba(255, 255, 255, 0.35)");
    expect(clone.style.borderRadius).toBe("8px");
    expect(clone.style.boxShadow).toBe("0 8px 32px rgba(0, 0, 0, 0.08)");
    expect(clone.style.position).toBe("relative");
    expect(clone.style.transform).toBe("none");
  });
});
