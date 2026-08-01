/** Hides the source element while keeping layout so its rect can be tracked during scroll. */
export const hideElementPreservingLayout = (
  element: HTMLElement,
): (() => void) => {
  const snapshot = {
    opacity: element.style.opacity,
    pointerEvents: element.style.pointerEvents,
    visibility: element.style.visibility,
  };

  element.style.opacity = "0";
  element.style.pointerEvents = "none";

  return () => {
    element.style.opacity = snapshot.opacity;
    element.style.pointerEvents = snapshot.pointerEvents;
    element.style.visibility = snapshot.visibility;
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
