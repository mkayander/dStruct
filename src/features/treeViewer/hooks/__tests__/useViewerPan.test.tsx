import { act, renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";

import { editorSlice } from "#/features/treeViewer/model/editorSlice";
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
  it("handlePanEnd always clears isPanning state", () => {
    const { store, wrapper } = createWrapper();

    const { result } = renderHook(() => useViewerPan(), { wrapper });

    act(() => {
      store.dispatch(editorSlice.actions.setIsPanning(true));
    });
    expect(store.getState().editor.isPanning).toBe(true);

    act(() => {
      result.current.handlePanEnd();
    });
    expect(store.getState().editor.isPanning).toBe(false);
  });
});
