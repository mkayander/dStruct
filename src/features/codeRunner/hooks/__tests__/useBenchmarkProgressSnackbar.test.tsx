import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useBenchmarkProgressSnackbar } from "#/features/codeRunner/hooks/useBenchmarkProgressSnackbar";
import { benchmarkSlice } from "#/features/codeRunner/model/benchmarkSlice";
import { makeStore } from "#/store/makeStore";

const mockEnqueueSnackbar = vi.fn();
const mockCloseSnackbar = vi.fn();

vi.mock("notistack", () => ({
  useSnackbar: () => ({
    enqueueSnackbar: mockEnqueueSnackbar,
    closeSnackbar: mockCloseSnackbar,
  }),
}));

describe("useBenchmarkProgressSnackbar", () => {
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

    renderHook(() => useBenchmarkProgressSnackbar(), { wrapper });

    act(() => {
      store.dispatch(
        benchmarkSlice.actions.setProgress({ current: 32, total: 128 }),
      );
    });

    expect(mockEnqueueSnackbar).toHaveBeenCalledTimes(1);
    expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        variant: "success",
        hideIconVariant: true,
        persist: true,
        key: "benchmark-progress",
      }),
    );
  });

  it("should close snackbar when progress is cleared", () => {
    const { store, wrapper } = createWrapper();

    renderHook(() => useBenchmarkProgressSnackbar(), { wrapper });

    act(() => {
      store.dispatch(
        benchmarkSlice.actions.setProgress({ current: 64, total: 128 }),
      );
    });
    expect(mockEnqueueSnackbar).toHaveBeenCalled();

    act(() => {
      store.dispatch(benchmarkSlice.actions.clearProgress());
    });

    expect(mockCloseSnackbar).toHaveBeenCalledWith("benchmark-progress");
  });

  it("should not show snackbar again when progress updates but snackbar already shown", () => {
    const { store, wrapper } = createWrapper();

    renderHook(() => useBenchmarkProgressSnackbar(), { wrapper });

    act(() => {
      store.dispatch(
        benchmarkSlice.actions.setProgress({ current: 32, total: 128 }),
      );
    });
    expect(mockEnqueueSnackbar).toHaveBeenCalledTimes(1);

    act(() => {
      store.dispatch(
        benchmarkSlice.actions.setProgress({ current: 64, total: 128 }),
      );
    });

    expect(mockEnqueueSnackbar).toHaveBeenCalledTimes(1);
  });

  it("should close snackbar on unmount when it was shown", () => {
    const { store, wrapper } = createWrapper();

    const { unmount } = renderHook(() => useBenchmarkProgressSnackbar(), {
      wrapper,
    });

    act(() => {
      store.dispatch(
        benchmarkSlice.actions.setProgress({ current: 64, total: 128 }),
      );
    });

    unmount();

    expect(mockCloseSnackbar).toHaveBeenCalledWith("benchmark-progress");
  });
});
