import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePlaygroundSlugLoadingSync } from "#/features/playground/hooks/usePlaygroundSlugLoadingSync";
import { projectSlice } from "#/features/project/model/projectSlice";
import { makeStore } from "#/store/makeStore";

const mockUsePlaygroundRoute = vi.fn(() => ({
  basePath: "/playground",
  slug: ["two-sum", "case-1", "solution-1"],
  pathname: "/playground/two-sum/case-1/solution-1",
  navigateTo: vi.fn(),
}));

const mockServerPrefetchMatchesRoute = vi.fn(
  (_initialData: unknown, _slug: unknown) => false,
);

vi.mock("#/shared/hooks/usePlaygroundRoute", () => ({
  usePlaygroundRoute: () => mockUsePlaygroundRoute(),
}));

vi.mock("#/features/playground/lib/serverPrefetchMatchesRoute", () => ({
  serverPrefetchMatchesRoute: (initialData: unknown, slug: unknown) =>
    mockServerPrefetchMatchesRoute(initialData, slug),
}));

vi.mock("#/features/playground/context/PlaygroundInitialDataContext", () => ({
  usePlaygroundInitialData: () => null,
}));

describe("usePlaygroundSlugLoadingSync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePlaygroundRoute.mockReturnValue({
      basePath: "/playground",
      slug: ["two-sum", "case-1", "solution-1"],
      pathname: "/playground/two-sum/case-1/solution-1",
      navigateTo: vi.fn(),
    });
    mockServerPrefetchMatchesRoute.mockReturnValue(false);
  });

  it("skips loadStart on first render when server prefetch matches the URL", () => {
    mockServerPrefetchMatchesRoute.mockReturnValue(true);

    const store = makeStore();
    store.dispatch(projectSlice.actions.loadFinish());

    renderHook(() => usePlaygroundSlugLoadingSync(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(store.getState().project.isInitialized).toBe(true);
  });

  it("dispatches loadStart when slug segments change", () => {
    const store = makeStore();

    const { rerender } = renderHook(() => usePlaygroundSlugLoadingSync(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(store.getState().project.isInitialized).toBe(false);

    store.dispatch(projectSlice.actions.loadFinish());
    expect(store.getState().project.isInitialized).toBe(true);

    mockUsePlaygroundRoute.mockReturnValue({
      basePath: "/playground",
      slug: ["three-sum"],
      pathname: "/playground/three-sum",
      navigateTo: vi.fn(),
    });

    rerender();

    expect(store.getState().project.isInitialized).toBe(false);
  });
});
