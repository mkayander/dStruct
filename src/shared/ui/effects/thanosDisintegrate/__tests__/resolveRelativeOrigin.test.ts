import { describe, expect, it } from "vitest";

import { resolveRelativeOrigin } from "#/shared/ui/effects/thanosDisintegrate/resolveRelativeOrigin";

describe("resolveRelativeOrigin", () => {
  it("converts client coordinates into element-local coordinates", () => {
    const element = document.createElement("div");
    element.getBoundingClientRect = () =>
      ({
        left: 100,
        top: 200,
        width: 400,
        height: 80,
        right: 500,
        bottom: 280,
        x: 100,
        y: 200,
        toJSON: () => ({}),
      }) as DOMRect;

    expect(
      resolveRelativeOrigin(element, { clientX: 150, clientY: 230 }),
    ).toEqual({
      x: 50,
      y: 30,
    });
  });
});
