import { clearWaveMaskFromElement } from "#/shared/ui/effects/thanosDisintegrate/syncElementWaveMask";

/** Keeps the live surface visible; particles render on a canvas beneath it. */
export const prepareElementForDisintegrate = (
  element: HTMLElement,
): ((options?: { restoreOpacity?: boolean }) => void) => {
  const snapshot = {
    pointerEvents: element.style.pointerEvents,
    opacity: element.style.opacity,
  };

  element.style.pointerEvents = "none";

  return (options) => {
    element.style.pointerEvents = snapshot.pointerEvents;
    if (options?.restoreOpacity !== false) {
      element.style.opacity = snapshot.opacity;
    }
    clearWaveMaskFromElement(element);
  };
};

export const syncFixedOverlayToElement = (
  overlay: HTMLElement,
  element: HTMLElement,
): DOMRect => {
  const rect = element.getBoundingClientRect();
  overlay.style.left = `${rect.left}px`;
  overlay.style.top = `${rect.top}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  return rect;
};

const isScrollableOverflow = (value: string): boolean =>
  value === "auto" || value === "scroll" || value === "overlay";

/** Returns scroll/resize targets that can move `element` relative to the viewport. */
export const collectViewportChangeTargets = (
  element: HTMLElement,
): Set<EventTarget> => {
  const targets = new Set<EventTarget>([window]);
  let node: HTMLElement | null = element.parentElement;

  while (node) {
    const { overflowX, overflowY } = window.getComputedStyle(node);
    if (isScrollableOverflow(overflowX) || isScrollableOverflow(overflowY)) {
      targets.add(node);
    }
    node = node.parentElement;
  }

  return targets;
};

export const subscribeToViewportChanges = (
  element: HTMLElement,
  listener: () => void,
): (() => void) => {
  const listenerOptions = { passive: true, capture: true } as const;
  const targets = collectViewportChangeTargets(element);

  for (const target of targets) {
    target.addEventListener("scroll", listener, listenerOptions);
  }

  window.addEventListener("resize", listener, listenerOptions);

  const visualViewport = window.visualViewport;
  visualViewport?.addEventListener("scroll", listener, listenerOptions);
  visualViewport?.addEventListener("resize", listener, listenerOptions);

  return () => {
    for (const target of targets) {
      target.removeEventListener("scroll", listener, listenerOptions);
    }

    window.removeEventListener("resize", listener, listenerOptions);
    visualViewport?.removeEventListener("scroll", listener, listenerOptions);
    visualViewport?.removeEventListener("resize", listener, listenerOptions);
  };
};
