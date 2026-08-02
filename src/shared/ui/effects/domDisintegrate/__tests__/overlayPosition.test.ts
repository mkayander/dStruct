import { afterEach, describe, expect, it } from "vitest";

import {
  collectViewportChangeTargets,
  prepareElementForDisintegrate,
  syncFixedOverlayToElement,
} from "#/shared/ui/effects/domDisintegrate/overlayPosition";

describe("overlayPosition", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("collects scrollable ancestors for viewport sync", () => {
    const scrollContainer = document.createElement("div");
    scrollContainer.style.overflowY = "auto";
    scrollContainer.style.height = "100px";

    const element = document.createElement("div");
    scrollContainer.appendChild(element);
    document.body.appendChild(scrollContainer);

    const targets = collectViewportChangeTargets(element);

    expect(targets.has(window)).toBe(true);
    expect(targets.has(scrollContainer)).toBe(true);
  });

  it("syncs fixed overlay coordinates from the live element rect", () => {
    const element = document.createElement("div");
    const overlay = document.createElement("canvas");

    document.body.appendChild(element);
    element.getBoundingClientRect = () =>
      ({
        left: 24,
        top: 48,
        width: 320,
        height: 120,
        right: 344,
        bottom: 168,
        x: 24,
        y: 48,
        toJSON: () => ({}),
      }) as DOMRect;

    const rect = syncFixedOverlayToElement(overlay, element);

    expect(rect.left).toBe(24);
    expect(overlay.style.left).toBe("24px");
    expect(overlay.style.top).toBe("48px");
    expect(overlay.style.width).toBe("320px");
    expect(overlay.style.height).toBe("120px");
  });

  it("expands the overlay when particle bleed padding is provided", () => {
    const element = document.createElement("div");
    const overlay = document.createElement("canvas");

    document.body.appendChild(element);
    element.getBoundingClientRect = () =>
      ({
        left: 24,
        top: 48,
        width: 320,
        height: 120,
        right: 344,
        bottom: 168,
        x: 24,
        y: 48,
        toJSON: () => ({}),
      }) as DOMRect;

    syncFixedOverlayToElement(overlay, element, 40);

    expect(overlay.style.left).toBe("-16px");
    expect(overlay.style.top).toBe("8px");
    expect(overlay.style.width).toBe("400px");
    expect(overlay.style.height).toBe("200px");
  });

  it("restores pointer events and opacity after disintegrate cleanup", () => {
    const element = document.createElement("div");
    element.style.pointerEvents = "auto";
    element.style.opacity = "0.75";

    const restoreElement = prepareElementForDisintegrate(element);

    expect(element.style.pointerEvents).toBe("none");

    restoreElement();

    expect(element.style.pointerEvents).toBe("auto");
    expect(element.style.opacity).toBe("0.75");
  });

  it("can keep opacity hidden after a successful disintegrate", () => {
    const element = document.createElement("div");
    element.style.opacity = "0.75";

    const restoreElement = prepareElementForDisintegrate(element);
    element.style.opacity = "0";

    restoreElement({ restoreOpacity: false });

    expect(element.style.opacity).toBe("0");
  });
});
