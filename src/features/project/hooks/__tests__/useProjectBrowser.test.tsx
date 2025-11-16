import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  mockSetBrowserParam,
  mockUseSearchParam,
  resetAllMocks,
} from "#/features/project/ui/ProjectBrowser/__tests__/testUtils";
import { ProjectBrowserProvider } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { makeStore } from "#/store/makeStore";

import { useProjectBrowser } from "../useProjectBrowser";

// Mock tRPC API before importing the hook
const mockUseQuery = vi.fn();
vi.mock("#/shared/lib", async () => {
  const actual = await vi.importActual("#/shared/lib");
  return {
    ...actual,
    api: {
      project: {
        allBrief: {
          useQuery: () => mockUseQuery(),
        },
      },
    },
  };
});

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

const createWrapper = () => {
  const store = makeStore();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ReduxProvider store={store}>
      <ProjectBrowserProvider>{children}</ProjectBrowserProvider>
    </ReduxProvider>
  );
  Wrapper.displayName = "TestWrapper";
  return Wrapper;
};

describe("useProjectBrowser", () => {
  beforeEach(() => {
    resetAllMocks();
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
  });

  it("should return initial browser state", () => {
    const { result } = renderHook(() => useProjectBrowser(), {
      wrapper: createWrapper(),
    });

    expect(result.current.searchQuery).toBe("");
    expect(result.current.selectedCategories).toEqual([]);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.openBrowser).toBeDefined();
    expect(result.current.closeBrowser).toBeDefined();
  });

  it("should sync isLoading from query", async () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useProjectBrowser(), {
      wrapper: createWrapper(),
    });

    // The hook should sync isLoading state
    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(true);
      },
      { timeout: 1000 },
    );
  });

  it("should return projects from query", () => {
    const mockProjects = [
      {
        id: "1",
        title: "Test Project",
        slug: "test-project",
        category: "ARRAY" as const,
        difficulty: "EASY" as const,
        createdAt: new Date(),
        author: {
          id: "author-1",
          name: "Test Author",
          bucketImage: "https://example.com/avatar.jpg",
        },
      },
    ];

    mockUseQuery.mockReturnValue({
      data: mockProjects,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useProjectBrowser(), {
      wrapper: createWrapper(),
    });

    expect(result.current.projects).toEqual(mockProjects);
  });

  it("should open browser when openBrowser is called", () => {
    const { result } = renderHook(() => useProjectBrowser(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.openBrowser();
    });

    expect(mockSetBrowserParam).toHaveBeenCalledWith("true");
    // Note: isOpen state comes from URL param, which is mocked to return ""
    // In real usage, the URL param would update and isOpen would become true
  });

  it("should close browser when closeBrowser is called", () => {
    // Mock browser param to be "true" initially
    mockUseSearchParam.mockImplementation((param: string) => {
      if (param === "browser") {
        return ["true", mockSetBrowserParam];
      }
      return ["", vi.fn()];
    });

    const { result } = renderHook(() => useProjectBrowser(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isOpen).toBe(true);

    // Then close
    act(() => {
      result.current.closeBrowser();
    });

    expect(mockSetBrowserParam).toHaveBeenCalledWith("");
  });

  it("should handle query loading state", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useProjectBrowser(), {
      wrapper: createWrapper(),
    });

    // isLoading should be synced from query
    expect(result.current.isLoading).toBe(true);
  });
});
