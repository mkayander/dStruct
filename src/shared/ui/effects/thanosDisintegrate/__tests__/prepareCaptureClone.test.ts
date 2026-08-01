import { afterEach, describe, expect, it, vi } from "vitest";

import { prepareCaptureClone } from "#/shared/ui/effects/thanosDisintegrate/prepareCaptureClone";

describe("prepareCaptureClone", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("strips backdrop filters using setProperty for the webkit variant", () => {
    const element = document.createElement("div");
    element.style.backdropFilter = "blur(20px) saturate(180%)";
    element.style.setProperty(
      "-webkit-backdrop-filter",
      "blur(20px) saturate(180%)",
    );

    window.getComputedStyle = vi.fn(
      () =>
        ({
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          color: "rgb(17, 24, 39)",
          border: "1px solid rgba(255, 255, 255, 0.35)",
          borderRadius: "8px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        }) as CSSStyleDeclaration,
    );

    const setPropertySpy = vi.spyOn(CSSStyleDeclaration.prototype, "setProperty");
    const clone = prepareCaptureClone(element);

    expect(clone.style.backdropFilter).toBe("none");
    expect(setPropertySpy).toHaveBeenCalledWith("-webkit-backdrop-filter", "none");
  });

  it("copies computed raster-friendly styles onto the clone", () => {
    const element = document.createElement("div");

    window.getComputedStyle = vi.fn(
      () =>
        ({
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          color: "rgb(17, 24, 39)",
          border: "1px solid rgba(255, 255, 255, 0.35)",
          borderRadius: "8px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
        }) as CSSStyleDeclaration,
    );

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
