import { type RefObject, useEffect, useState } from "react";

/** Pause autoplay when less than this fraction of the preview is visible. */
const MIN_VISIBLE_INTERSECTION_RATIO = 0.4;

/** Resume autoplay after page scroll is idle for this long. */
const PAGE_SCROLL_IDLE_MS = 200;

export type UseLandingHeroPreviewPlaybackGateResult = {
  /** When true, hero preview autoplay and auto-replay should not run. */
  isPlaybackSuppressed: boolean;
};

/** Capture-phase document listeners see nested scrollers; ignore preview internals. */
export const isLandingPreviewNestedScroll = (
  event: Event,
  previewRoot: HTMLElement | null,
): boolean => {
  if (!previewRoot) {
    return false;
  }

  const scrollTarget = event.target;
  return scrollTarget instanceof Node && previewRoot.contains(scrollTarget);
};

/**
 * Suppresses landing hero preview playback while the user scrolls the page or
 * when the preview is mostly off-screen — reduces jank from Redux + layout
 * updates fighting scroll compositing.
 */
export const useLandingHeroPreviewPlaybackGate = (
  rootRef: RefObject<HTMLElement | null>,
): UseLandingHeroPreviewPlaybackGateResult => {
  const [isSufficientlyVisible, setIsSufficientlyVisible] = useState(true);
  const [isPageScrolling, setIsPageScrolling] = useState(false);
  const [scrollActivityVersion, setScrollActivityVersion] = useState(0);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) {
      return;
    }

    if (typeof IntersectionObserver !== "function") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }

        setIsSufficientlyVisible(
          entry.isIntersecting &&
            entry.intersectionRatio >= MIN_VISIBLE_INTERSECTION_RATIO,
        );
      },
      { threshold: [0, 0.25, 0.4, 0.5, 0.75, 1] },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootRef]);

  useEffect(() => {
    const markPageScrolling = (event: Event) => {
      if (isLandingPreviewNestedScroll(event, rootRef.current)) {
        return;
      }

      setIsPageScrolling(true);
      setScrollActivityVersion((version) => version + 1);
    };

    document.addEventListener("scroll", markPageScrolling, {
      capture: true,
      passive: true,
    });

    return () => {
      document.removeEventListener("scroll", markPageScrolling, {
        capture: true,
      });
    };
  }, [rootRef]);

  // Each scroll bumps scrollActivityVersion; effect cleanup clears the prior idle timer.
  useEffect(() => {
    if (scrollActivityVersion === 0) {
      return undefined;
    }

    const idleTimeoutId = setTimeout(() => {
      setIsPageScrolling(false);
    }, PAGE_SCROLL_IDLE_MS);

    return () => clearTimeout(idleTimeoutId);
  }, [scrollActivityVersion]);

  return {
    isPlaybackSuppressed: !isSufficientlyVisible || isPageScrolling,
  };
};
