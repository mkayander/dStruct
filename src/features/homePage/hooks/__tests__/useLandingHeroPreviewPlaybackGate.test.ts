import { act, renderHook } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useLandingHeroPreviewPlaybackGate } from "#/features/homePage/hooks/useLandingHeroPreviewPlaybackGate";

describe("useLandingHeroPreviewPlaybackGate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts unsuppressed when IntersectionObserver is unavailable", () => {
    const previewRootRef = createRef<HTMLDivElement>();
    const element = document.createElement("div");
    previewRootRef.current = element;

    const intersectionObserver = globalThis.IntersectionObserver;
    // @ts-expect-error — simulate environments without IO
    delete globalThis.IntersectionObserver;

    const { result } = renderHook(() =>
      useLandingHeroPreviewPlaybackGate({
        previewRootRef,
        pageScrollViewport: null,
      }),
    );

    expect(result.current.isPlaybackSuppressed).toBe(false);

    globalThis.IntersectionObserver = intersectionObserver;
  });

  it("suppresses playback while the page scroll container is scrolling", () => {
    const previewRootRef = createRef<HTMLDivElement>();
    previewRootRef.current = document.createElement("div");
    const pageScrollViewport = document.createElement("div");

    const { result } = renderHook(() =>
      useLandingHeroPreviewPlaybackGate({
        previewRootRef,
        pageScrollViewport,
      }),
    );

    act(() => {
      pageScrollViewport.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.isPlaybackSuppressed).toBe(true);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.isPlaybackSuppressed).toBe(false);
  });

  it("does not attach a scroll listener until the page viewport is available", () => {
    const previewRootRef = createRef<HTMLDivElement>();
    previewRootRef.current = document.createElement("div");
    const pageScrollViewport = document.createElement("div");
    const addListenerSpy = vi.spyOn(pageScrollViewport, "addEventListener");

    const { rerender } = renderHook(
      ({ pageScrollViewport: viewport }) =>
        useLandingHeroPreviewPlaybackGate({
          previewRootRef,
          pageScrollViewport: viewport,
        }),
      { initialProps: { pageScrollViewport: null as HTMLDivElement | null } },
    );

    expect(addListenerSpy).not.toHaveBeenCalled();

    rerender({ pageScrollViewport });

    expect(addListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true },
    );

    addListenerSpy.mockRestore();
  });

  it("suppresses playback when the preview is mostly off-screen", () => {
    const previewRootRef = createRef<HTMLDivElement>();
    const element = document.createElement("div");
    previewRootRef.current = element;

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
      useLandingHeroPreviewPlaybackGate({
        previewRootRef,
        pageScrollViewport: null,
      }),
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
