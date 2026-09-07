import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePlaygroundPanelsReady } from "#/features/playground/hooks/usePlaygroundPanelsReady";
import { projectSlice } from "#/features/project/model/projectSlice";
import { makeStore } from "#/store/makeStore";

const mockUsePlaygroundMobileLayout = vi.fn(() => false);
const mockUsePlaygroundRoute = vi.fn(() => ({
  basePath: "/playground",
  slug: ["two-sum"],
  pathname: "/playground/two-sum",
  navigateTo: vi.fn(),
}));

vi.mock("#/features/playground/hooks/usePlaygroundMobileLayout", () => ({
  usePlaygroundMobileLayout: () => mockUsePlaygroundMobileLayout(),
}));

vi.mock("#/shared/hooks/usePlaygroundRoute", () => ({
  usePlaygroundRoute: () => mockUsePlaygroundRoute(),
}));

vi.mock(
  "#/shared/ui/templates/SplitPanelsLayout/prefetchSplitPanelsLayout",
  () => ({
    prefetchSplitPanelsLayout: vi.fn(() => Promise.resolve({})),
  }),
);

describe("usePlaygroundPanelsReady", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePlaygroundMobileLayout.mockReturnValue(false);
    mockUsePlaygroundRoute.mockReturnValue({
      basePath: "/playground",
      slug: ["two-sum"],
      pathname: "/playground/two-sum",
      navigateTo: vi.fn(),
    });
  });

  it("returns false on desktop until split layout loads and project is initialized", async () => {
    const store = makeStore();

    const { result } = renderHook(() => usePlaygroundPanelsReady(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toBe(false);

    store.dispatch(projectSlice.actions.loadFinish());

    await vi.waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("returns true on mobile browse view without a project slug", () => {
    mockUsePlaygroundMobileLayout.mockReturnValue(true);
    mockUsePlaygroundRoute.mockReturnValue({
      basePath: "/playground",
      slug: [],
      pathname: "/playground",
      navigateTo: vi.fn(),
    });

    const store = makeStore();

    const { result } = renderHook(() => usePlaygroundPanelsReady(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current).toBe(true);
  });

  it("returns true on desktop bare /playground after split layout loads", async () => {
    mockUsePlaygroundRoute.mockReturnValue({
      basePath: "/playground",
      slug: [],
      pathname: "/playground",
      navigateTo: vi.fn(),
    });

    const store = makeStore();

    const { result } = renderHook(() => usePlaygroundPanelsReady(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    await vi.waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
