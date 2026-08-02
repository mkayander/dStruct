import { describe, expect, it } from "vitest";

import { DOM_DISINTEGRATE_DEFAULTS } from "../constants";
import { resolveDomDisintegrateOptions } from "../resolveDomDisintegrateOptions";

describe("resolveDomDisintegrateOptions", () => {
  it("returns defaults when no element is provided", () => {
    expect(resolveDomDisintegrateOptions()).toEqual(DOM_DISINTEGRATE_DEFAULTS);
  });

  it("lets explicit options override quality tuning", () => {
    const element = document.createElement("div");
    Object.defineProperty(element, "offsetWidth", { value: 400 });
    Object.defineProperty(element, "offsetHeight", { value: 300 });

    const resolved = resolveDomDisintegrateOptions(
      { particleStep: 2, maxDuration: 1.5 },
      element,
    );

    expect(resolved.particleStep).toBe(2);
    expect(resolved.maxDuration).toBe(1.5);
  });
});
