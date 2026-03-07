import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePyodideProgressSnackbar } from "#/features/codeRunner/hooks/usePyodideProgressSnackbar";
import { pyodideSlice } from "#/features/codeRunner/model/pyodideSlice";
import { makeStore } from "#/store/makeStore";

const mockEnqueueSnackbar = vi.fn();
const mockCloseSnackbar = vi.fn();

vi.mock("notistack", () => ({
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueueSnackbar,
    closeSnackbar: mockCloseSnackbar,
  }),
}));

describe("usePyodideProgressSnackbar", () => {
  const createWrapper = () => {
    const store = makeStore();
    return {
      store,
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      ),
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show snackbar when progress is set", () => {
    const { store, wrapper } = createWrapper();

    renderHook(() => usePyodideProgressSnackbar(), { wrapper });

    act(() => {
      store.dispatch(
        pyodideSlice.actions.setProgress({ value: 50, stage: "Loading..." }),
      );
    });

    expect(mockEnqueueSnackbar).toHaveBeenCalledTimes(1);
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        variant: "info",
        persist: true,
        key: "pyodide-loading",
      }),
    );
  });

  it("should close snackbar when progress is cleared", () => {
    const { store, wrapper } = createWrapper();

    renderHook(() => usePyodideProgressSnackbar(), { wrapper });

    act(() => {
      store.dispatch(
        pyodideSlice.actions.setProgress({ value: 50, stage: "Loading..." }),
      );
    });
    expect(mockEnqueueSnackbar).toHaveBeenCalled();

    act(() => {
      store.dispatch(pyodideSlice.actions.clearProgress());
    });

    expect(mockCloseSnackbar).toHaveBeenCalledWith("pyodide-loading");
  });

  it("should close snackbar on unmount when it was shown", () => {
    const { store, wrapper } = createWrapper();

    const { unmount } = renderHook(() => usePyodideProgressSnackbar(), {
      wrapper,
    });

    act(() => {
      store.dispatch(
        pyodideSlice.actions.setProgress({ value: 50, stage: "Loading..." }),
      );
    });

    unmount();

    expect(mockCloseSnackbar).toHaveBeenCalledWith("pyodide-loading");
  });
});
