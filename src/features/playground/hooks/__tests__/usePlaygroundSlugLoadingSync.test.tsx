import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePlaygroundSlugLoadingSync } from "#/features/playground/hooks/usePlaygroundSlugLoadingSync";
import { projectSlice } from "#/features/project/model/projectSlice";
import { makeStore } from "#/store/makeStore";

const mockUsePlaygroundRoute = vi.fn(() => ({
  basePath: "/playground",
  slug: ["two-sum"],
  pathname: "/playground/two-sum",
  navigateTo: vi.fn(),
}));

vi.mock("#/shared/hooks/usePlaygroundRoute", () => ({
  usePlaygroundRoute: () => mockUsePlaygroundRoute(),
}));

describe("usePlaygroundSlugLoadingSync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePlaygroundRoute.mockReturnValue({
      basePath: "/playground",
      slug: ["two-sum"],
      pathname: "/playground/two-sum",
      navigateTo: vi.fn(),
    });
  });

  it("dispatches loadStart when slug segments change", () => {
    const store = makeStore();
    store.dispatch(projectSlice.actions.loadFinish());

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
