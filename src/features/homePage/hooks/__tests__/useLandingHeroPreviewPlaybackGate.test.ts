import { act, renderHook } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  isLandingPreviewNestedScroll,
  useLandingHeroPreviewPlaybackGate,
} from "#/features/homePage/hooks/useLandingHeroPreviewPlaybackGate";

describe("useLandingHeroPreviewPlaybackGate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts unsuppressed when IntersectionObserver is unavailable", () => {
    const rootRef = createRef<HTMLDivElement>();
    const element = document.createElement("div");
    rootRef.current = element;

    const intersectionObserver = globalThis.IntersectionObserver;
    // @ts-expect-error — simulate environments without IO
    delete globalThis.IntersectionObserver;

    const { result } = renderHook(() =>
      useLandingHeroPreviewPlaybackGate(rootRef),
    );

    expect(result.current.isPlaybackSuppressed).toBe(false);

    globalThis.IntersectionObserver = intersectionObserver;
  });

  it("suppresses playback while the page is scrolling", () => {
    const rootRef = createRef<HTMLDivElement>();
    const previewRoot = document.createElement("div");
    rootRef.current = previewRoot;
    document.body.append(previewRoot);

    const pageScroller = document.createElement("div");
    document.body.append(pageScroller);

    const { result } = renderHook(() =>
      useLandingHeroPreviewPlaybackGate(rootRef),
    );

    act(() => {
      pageScroller.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.isPlaybackSuppressed).toBe(true);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.isPlaybackSuppressed).toBe(false);

    previewRoot.remove();
    pageScroller.remove();
  });

  it("does not suppress playback when scrolling inside the preview", () => {
    const rootRef = createRef<HTMLDivElement>();
    const previewRoot = document.createElement("div");
    rootRef.current = previewRoot;
    document.body.append(previewRoot);

    const callstackViewport = document.createElement("div");
    previewRoot.append(callstackViewport);

    const { result } = renderHook(() =>
      useLandingHeroPreviewPlaybackGate(rootRef),
    );

    act(() => {
      callstackViewport.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.isPlaybackSuppressed).toBe(false);

    previewRoot.remove();
  });

  it("isLandingPreviewNestedScroll detects scroll inside the preview root", () => {
    const previewRoot = document.createElement("div");
    const nestedScroller = document.createElement("div");
    previewRoot.append(nestedScroller);

    const nestedEvent = new Event("scroll");
    Object.defineProperty(nestedEvent, "target", { value: nestedScroller });

    expect(isLandingPreviewNestedScroll(nestedEvent, previewRoot)).toBe(true);

    const pageScroller = document.createElement("div");
    const pageEvent = new Event("scroll");
    Object.defineProperty(pageEvent, "target", { value: pageScroller });

    expect(isLandingPreviewNestedScroll(pageEvent, previewRoot)).toBe(false);
  });

  it("suppresses playback when the preview is mostly off-screen", () => {
    const rootRef = createRef<HTMLDivElement>();
    const element = document.createElement("div");
    rootRef.current = element;

    let observerCallback: IntersectionObserverCallback = () => undefined;

    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }

      observe() {
        return undefined;
      }

      disconnect() {
        return undefined;
      }
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    const { result } = renderHook(() =>
      useLandingHeroPreviewPlaybackGate(rootRef),
    );

    act(() => {
      observerCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.2,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(result.current.isPlaybackSuppressed).toBe(true);

    act(() => {
      observerCallback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.75,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(result.current.isPlaybackSuppressed).toBe(false);

    vi.unstubAllGlobals();
  });
});
