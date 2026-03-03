import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  mockSetViewParam,
  mockUseSearchParam,
  resetAllMocks,
} from "#/features/project/ui/ProjectBrowser/__tests__/testUtils";
import {
  ProjectBrowserProvider,
  useProjectBrowserContext,
} from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { StateThemeProvider } from "#/shared/ui/providers/StateThemeProvider";

// Setup mocks at top level (vi.mock() must be hoisted)
vi.mock("#/shared/hooks", async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import("#/shared/hooks")>();
  return {
    ...actual,
    useSearchParam: (param: string) => mockUseSearchParam(param),
  };
});

vi.mock("next/router", () => ({
  useRouter: vi.fn(() => ({
    pathname: "/",
    query: {},
    push: vi.fn(),
  })),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <StateThemeProvider>
    <ProjectBrowserProvider>{children}</ProjectBrowserProvider>
  </StateThemeProvider>
);

/**
 * Tests for useProjectBrowserContext hook.
 * This replaces the deprecated useProjectBrowser hook tests.
 */
describe("useProjectBrowserContext", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it("should return initial browser state", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    expect(result.current.searchQuery).toBe("");
    expect(result.current.selectedCategories).toEqual([]);
    expect(result.current.selectedDifficulties).toEqual([]);
    expect(result.current.showOnlyNew).toBe(false);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.sortBy).toBe("category");
    expect(result.current.sortOrder).toBe("asc");
    expect(result.current.openBrowser).toBeDefined();
    expect(result.current.closeBrowser).toBeDefined();
  });

  it("should open browser when openBrowser is called", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.openBrowser();
    });

    expect(mockSetViewParam).toHaveBeenCalledWith("browse");
  });

  it("should close browser when closeBrowser is called", () => {
    mockUseSearchParam.mockImplementation((param: string) => {
      if (param === "view") {
        return ["browse", mockSetViewParam];
      }
      return ["", vi.fn()];
    });

    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeBrowser();
    });

    expect(mockSetViewParam).toHaveBeenCalledWith("");
  });
});
