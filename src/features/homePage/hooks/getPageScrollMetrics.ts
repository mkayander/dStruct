/**
 * MainLayout scrolls inside OverlayScrollbars (`[data-overlayscrollbars-viewport]`), not
 * on `window`. Use this helper so scroll-driven effects see the real scroll position.
 */
const OVERLAY_VIEWPORT_SELECTOR = "[data-overlayscrollbars-viewport]";

export type PageScrollMetrics = {
  scrollTop: number;
  scrollableHeight: number;
  viewportHeight: number;
};

export const resolvePageScrollElement = (): HTMLElement | null => {
  const node = document.querySelector(OVERLAY_VIEWPORT_SELECTOR);
  return node instanceof HTMLElement ? node : null;
};

export const getPageScrollMetrics = (
  scrollRoot: HTMLElement | Window,
): PageScrollMetrics => {
  if (scrollRoot instanceof HTMLElement) {
    const viewportHeight = scrollRoot.clientHeight;
    const scrollableHeight = Math.max(
      scrollRoot.scrollHeight - viewportHeight,
      1,
    );
    return {
      scrollTop: scrollRoot.scrollTop,
      scrollableHeight,
      viewportHeight,
    };
  }

  const viewportHeight = window.innerHeight;
  const scrollableHeight = Math.max(
    document.documentElement.scrollHeight - viewportHeight,
    1,
  );
  return {
    scrollTop: window.scrollY,
    scrollableHeight,
    viewportHeight,
  };
};
