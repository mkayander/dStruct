import { act, renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";

import { makeStore } from "#/store/makeStore";

import type { ViewerPanHandle } from "../useViewerPan";
import { useViewerPan } from "../useViewerPan";

const createWrapper = () => {
  const store = makeStore();
  return {
    store,
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    ),
  };
};

describe("useViewerPan", () => {
  it("handlePanEnd syncs accumulated offset to view state when mouse pan was active", () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useViewerPan(), { wrapper });

    act(() => {
      result.current.handlePanStart({
        button: 0,
        clientX: 100,
        clientY: 100,
        target: document.createElement("div"),
      } as unknown as React.MouseEvent);
    });

    act(() => {
      result.current.handleMouseMove({
        clientX: 150,
        clientY: 120,
        target: document.createElement("div"),
      } as unknown as React.MouseEvent);
    });

    act(() => {
      result.current.handlePanEnd();
    });

    const view = result.current.getViewState();
    expect(view.offsetX).toBe(50);
    expect(view.offsetY).toBe(20);
  });

  it("clears touchPanRef when pinch ends so remaining finger does not trigger pan jump", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useViewerPan(), { wrapper });

    act(() => {
      result.current.handleTouchStart({
        touches: [
          { clientX: 100, clientY: 100 } as Touch,
          { clientX: 150, clientY: 100 } as Touch,
        ],
        currentTarget: document.createElement("div"),
        preventDefault: () => {},
      } as unknown as React.TouchEvent);
    });

    act(() => {
      result.current.handleTouchEnd({
        touches: [{ clientX: 125, clientY: 100 } as Touch],
        currentTarget: document.createElement("div"),
      } as unknown as React.TouchEvent);
    });

    const view = result.current.getViewState();
    expect(view.scale).toBeGreaterThan(0);
    expect(view.offsetX).toBeDefined();
    expect(view.offsetY).toBeDefined();
  });

  it("resetView via imperative handle resets to default view", () => {
    const viewerPanRef = React.createRef<ViewerPanHandle | null>();
    const { wrapper } = createWrapper();
    renderHook(() => useViewerPan({ ref: viewerPanRef }), { wrapper });

    act(() => {
      viewerPanRef.current?.resetView();
    });

    expect(viewerPanRef.current?.isViewAtDefault).toBe(true);
  });
});
