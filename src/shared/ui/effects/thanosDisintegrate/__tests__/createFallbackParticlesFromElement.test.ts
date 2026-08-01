import { afterEach, describe, expect, it, vi } from "vitest";

import { createFallbackParticlesFromElement } from "#/shared/ui/effects/thanosDisintegrate/createFallbackParticlesFromElement";

describe("createFallbackParticlesFromElement", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("samples a single color per grid cell without stacking opaque child blocks", () => {
    const root = document.createElement("div");
    root.style.width = "90px";
    root.style.height = "30px";
    root.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 90,
        height: 30,
        right: 90,
        bottom: 30,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;

    const button = document.createElement("button");
    button.textContent = "Accept";
    button.style.width = "30px";
    button.style.height = "20px";
    root.appendChild(button);
    document.body.appendChild(root);

    document.elementsFromPoint = vi.fn((clientX: number) => {
      if (clientX > 45) {
        return [button, root];
      }
      return [root];
    });

    window.getComputedStyle = (element: Element) => {
      if (element === button) {
        return {
          backgroundColor: "rgb(255, 255, 255)",
          color: "rgb(30, 120, 220)",
          borderTopColor: "rgb(30, 120, 220)",
        } as CSSStyleDeclaration;
      }

      return {
        backgroundColor: "rgba(120, 130, 140, 0.6)",
        color: "rgb(20, 20, 20)",
        borderTopColor: "rgb(20, 20, 20)",
      } as CSSStyleDeclaration;
    };

    const particles = createFallbackParticlesFromElement(root, {
      particleStep: 30,
      particleSize: 2,
      maxVelocity: 1,
      windX: 0,
      windY: 0,
      gravity: 0,
    });

    expect(particles).toHaveLength(3);
    expect(
      particles.every((particle) => particle.color !== "rgb(255, 255, 255)"),
    ).toBe(true);
    expect(
      particles.some((particle) => particle.color === "rgb(30, 120, 220)"),
    ).toBe(true);
  });
});
