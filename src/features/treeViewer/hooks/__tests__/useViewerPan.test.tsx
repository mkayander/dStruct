import { act, renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";

import { makeStore } from "#/store/makeStore";

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
      } as React.MouseEvent);
    });

    act(() => {
      result.current.handleMouseMove({
        clientX: 150,
        clientY: 120,
        target: document.createElement("div"),
      } as React.MouseEvent);
    });

    act(() => {
      result.current.handlePanEnd();
    });

    const view = result.current.getViewState();
    expect(view.offsetX).toBe(50);
    expect(view.offsetY).toBe(20);
  });
});
