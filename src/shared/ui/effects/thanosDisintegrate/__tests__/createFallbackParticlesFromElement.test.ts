import { describe, expect, it } from "vitest";

import { createFallbackParticlesFromElement } from "#/shared/ui/effects/thanosDisintegrate/createFallbackParticlesFromElement";

describe("createFallbackParticlesFromElement", () => {
  it("creates particles from descendant background colors", () => {
    const root = document.createElement("div");
    root.style.width = "100px";
    root.style.height = "40px";
    root.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 100,
        height: 40,
        right: 100,
        bottom: 40,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    const button = document.createElement("button");
    button.textContent = "Accept";
    button.style.width = "40px";
    button.style.height = "20px";
    button.getBoundingClientRect = () =>
      ({
        left: 10,
        top: 10,
        width: 40,
        height: 20,
        right: 50,
        bottom: 30,
        x: 10,
        y: 10,
        toJSON: () => ({}),
      }) as DOMRect;

    root.appendChild(button);
    document.body.appendChild(root);

    window.getComputedStyle = (element: Element) => {
      const style = {
        backgroundColor: "transparent",
        color: "rgb(0, 0, 0)",
        borderTopColor: "rgb(0, 0, 0)",
      };
      if (element === button) {
        style.backgroundColor = "rgb(30, 120, 220)";
      }
      return style as CSSStyleDeclaration;
    };

    const particles = createFallbackParticlesFromElement(root, {
      particleStep: 10,
      particleSize: 2,
      maxVelocity: 1,
      windX: 0,
      windY: 0,
    });

    expect(particles.length).toBeGreaterThan(0);
    expect(
      particles.some((particle) => particle.color === "rgb(30, 120, 220)"),
    ).toBe(true);
  });
});
