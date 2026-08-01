import { describe, expect, it, vi } from "vitest";

import { sampleColorAtLocalPoint } from "#/shared/ui/effects/domDisintegrate/sampleColorAtLocalPoint";

describe("sampleColorAtLocalPoint", () => {
  it("prefers text color over bright button backgrounds", () => {
    const root = document.createElement("div");
    root.getBoundingClientRect = () =>
      ({
        left: 100,
        top: 200,
        width: 300,
        height: 80,
        right: 400,
        bottom: 280,
        x: 100,
        y: 200,
        toJSON: () => ({}),
      }) as DOMRect;

    const button = document.createElement("button");
    root.appendChild(button);
    document.body.appendChild(root);

    document.elementsFromPoint = vi.fn(() => [button, root]);
    window.getComputedStyle = (element: Element) => {
      if (element === button) {
        return {
          backgroundColor: "rgb(255, 255, 255)",
          color: "rgb(10, 80, 200)",
          borderTopColor: "rgb(10, 80, 200)",
        } as CSSStyleDeclaration;
      }

      return {
        backgroundColor: "rgba(120, 130, 140, 0.6)",
        color: "rgb(20, 20, 20)",
        borderTopColor: "rgb(20, 20, 20)",
      } as CSSStyleDeclaration;
    };

    expect(sampleColorAtLocalPoint(root, 150, 20)).toEqual({
      red: 10,
      green: 80,
      blue: 200,
      alpha: 1,
    });
  });
});
