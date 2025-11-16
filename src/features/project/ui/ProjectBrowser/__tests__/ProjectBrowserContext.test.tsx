import { ProjectCategory, ProjectDifficulty } from "@prisma/client";
import { renderHook } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  parseBoolean,
  parseCategories,
  parseDifficulties,
  parseSort,
  ProjectBrowserProvider,
  serializeBoolean,
  serializeCategories,
  serializeDifficulties,
  serializeSort,
  useProjectBrowserContext,
} from "../ProjectBrowserContext";
import {
  mockSetBrowserParam,
  mockSetCategoriesParam,
  mockSetDifficultiesParam,
  mockSetNewParam,
  mockSetSearchParam,
  mockSetSortParam,
  mockUseSearchParam,
  resetAllMocks,
} from "./testUtils";

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
  <ProjectBrowserProvider>{children}</ProjectBrowserProvider>
);

describe("ProjectBrowserContext - Helper Functions", () => {
  describe("parseCategories", () => {
    it("should return empty array for empty string", () => {
      expect(parseCategories("")).toEqual([]);
    });

    it("should return empty array for falsy value", () => {
      expect(parseCategories(null as unknown as string)).toEqual([]);
      expect(parseCategories(undefined as unknown as string)).toEqual([]);
    });

    it("should parse valid categories", () => {
      expect(parseCategories("ARRAY")).toEqual([ProjectCategory.ARRAY]);
      expect(parseCategories("ARRAY,BINARY_TREE")).toEqual([
        ProjectCategory.ARRAY,
        ProjectCategory.BINARY_TREE,
      ]);
    });

    it("should filter out invalid categories", () => {
      expect(parseCategories("ARRAY,INVALID,BINARY_TREE")).toEqual([
        ProjectCategory.ARRAY,
        ProjectCategory.BINARY_TREE,
      ]);
    });

    it("should handle single valid category", () => {
      expect(parseCategories("LINKED_LIST")).toEqual([
        ProjectCategory.LINKED_LIST,
      ]);
    });

    it("should return empty array if all categories are invalid", () => {
      expect(parseCategories("INVALID1,INVALID2")).toEqual([]);
    });
  });

  describe("serializeCategories", () => {
    it("should return empty string for empty array", () => {
      expect(serializeCategories([])).toBe("");
    });

    it("should serialize single category", () => {
      expect(serializeCategories([ProjectCategory.ARRAY])).toBe("ARRAY");
    });

    it("should serialize multiple categories", () => {
      expect(
        serializeCategories([
          ProjectCategory.ARRAY,
          ProjectCategory.BINARY_TREE,
        ]),
      ).toBe("ARRAY,BINARY_TREE");
    });

    it("should maintain order", () => {
      expect(
        serializeCategories([
          ProjectCategory.BINARY_TREE,
          ProjectCategory.ARRAY,
        ]),
      ).toBe("BINARY_TREE,ARRAY");
    });
  });

  describe("parseDifficulties", () => {
    it("should return empty array for empty string", () => {
      expect(parseDifficulties("")).toEqual([]);
    });

    it("should return empty array for falsy value", () => {
      expect(parseDifficulties(null as unknown as string)).toEqual([]);
      expect(parseDifficulties(undefined as unknown as string)).toEqual([]);
    });

    it("should parse valid difficulties", () => {
      expect(parseDifficulties("EASY")).toEqual([ProjectDifficulty.EASY]);
      expect(parseDifficulties("EASY,MEDIUM")).toEqual([
        ProjectDifficulty.EASY,
        ProjectDifficulty.MEDIUM,
      ]);
    });

    it("should filter out invalid difficulties", () => {
      expect(parseDifficulties("EASY,INVALID,HARD")).toEqual([
        ProjectDifficulty.EASY,
        ProjectDifficulty.HARD,
      ]);
    });

    it("should handle all valid difficulties", () => {
      expect(parseDifficulties("EASY,MEDIUM,HARD")).toEqual([
        ProjectDifficulty.EASY,
        ProjectDifficulty.MEDIUM,
        ProjectDifficulty.HARD,
      ]);
    });
  });

  describe("serializeDifficulties", () => {
    it("should return empty string for empty array", () => {
      expect(serializeDifficulties([])).toBe("");
    });

    it("should serialize single difficulty", () => {
      expect(serializeDifficulties([ProjectDifficulty.EASY])).toBe("EASY");
    });

    it("should serialize multiple difficulties", () => {
      expect(
        serializeDifficulties([
          ProjectDifficulty.EASY,
          ProjectDifficulty.MEDIUM,
        ]),
      ).toBe("EASY,MEDIUM");
    });

    it("should maintain order", () => {
      expect(
        serializeDifficulties([ProjectDifficulty.HARD, ProjectDifficulty.EASY]),
      ).toBe("HARD,EASY");
    });
  });

  describe("parseBoolean", () => {
    it("should return true for 'true'", () => {
      expect(parseBoolean("true")).toBe(true);
    });

    it("should return true for '1'", () => {
      expect(parseBoolean("1")).toBe(true);
    });

    it("should return false for empty string", () => {
      expect(parseBoolean("")).toBe(false);
    });

    it("should return false for other values", () => {
      expect(parseBoolean("false")).toBe(false);
      expect(parseBoolean("0")).toBe(false);
      expect(parseBoolean("yes")).toBe(false);
    });
  });

  describe("serializeBoolean", () => {
    it("should return 'true' for true", () => {
      expect(serializeBoolean(true)).toBe("true");
    });

    it("should return empty string for false", () => {
      expect(serializeBoolean(false)).toBe("");
    });
  });

  describe("parseSort", () => {
    it("should parse valid sort values", () => {
      expect(parseSort("titleAsc")).toEqual({
        sortBy: "title",
        sortOrder: "asc",
      });
      expect(parseSort("difficultyDesc")).toEqual({
        sortBy: "difficulty",
        sortOrder: "desc",
      });
      expect(parseSort("dateAsc")).toEqual({
        sortBy: "date",
        sortOrder: "asc",
      });
      expect(parseSort("categoryDesc")).toEqual({
        sortBy: "category",
        sortOrder: "desc",
      });
    });

    it("should be case insensitive", () => {
      expect(parseSort("TITLEASC")).toEqual({
        sortBy: "title",
        sortOrder: "asc",
      });
      expect(parseSort("difficultyDESC")).toEqual({
        sortBy: "difficulty",
        sortOrder: "desc",
      });
    });

    it("should default to categoryAsc for empty string", () => {
      expect(parseSort("")).toEqual({
        sortBy: "category",
        sortOrder: "asc",
      });
    });

    it("should default to categoryAsc for invalid values", () => {
      expect(parseSort("invalid")).toEqual({
        sortBy: "category",
        sortOrder: "asc",
      });
      expect(parseSort("titleInvalid")).toEqual({
        sortBy: "category",
        sortOrder: "asc",
      });
      expect(parseSort("invalidAsc")).toEqual({
        sortBy: "category",
        sortOrder: "asc",
      });
    });
  });

  describe("serializeSort", () => {
    it("should serialize sort values correctly", () => {
      expect(serializeSort("title", "asc")).toBe("titleAsc");
      expect(serializeSort("difficulty", "desc")).toBe("difficultyDesc");
      expect(serializeSort("date", "asc")).toBe("dateAsc");
      expect(serializeSort("category", "desc")).toBe("categoryDesc");
    });
  });
});

describe("ProjectBrowserContext - Provider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error when used outside provider", () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useProjectBrowserContext());
    }).toThrow(
      "useProjectBrowserContext must be used within ProjectBrowserProvider",
    );

    consoleSpy.mockRestore();
  });

  it("should provide default values when no URL params", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.selectedCategories).toEqual([]);
    expect(result.current.selectedDifficulties).toEqual([]);
    expect(result.current.showOnlyNew).toBe(false);
    expect(result.current.sortBy).toBe("category");
    expect(result.current.sortOrder).toBe("asc");
  });

  it("should call setBrowserParam when openBrowser is called", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    result.current.openBrowser();
    expect(mockSetBrowserParam).toHaveBeenCalledWith("true");
  });

  it("should call setBrowserParam with empty string when closeBrowser is called", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    result.current.closeBrowser();
    expect(mockSetBrowserParam).toHaveBeenCalledWith("");
  });

  it("should call setSearchParam when setSearchQuery is called", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    result.current.setSearchQuery("test query");
    expect(mockSetSearchParam).toHaveBeenCalledWith("test query");
  });

  it("should call setSearchParam with empty string for empty query", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    result.current.setSearchQuery("");
    expect(mockSetSearchParam).toHaveBeenCalledWith("");
  });

  it("should call setCategoriesParam when setSelectedCategories is called", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    result.current.setSelectedCategories([
      ProjectCategory.ARRAY,
      ProjectCategory.BINARY_TREE,
    ]);
    expect(mockSetCategoriesParam).toHaveBeenCalledWith("ARRAY,BINARY_TREE");
  });

  it("should call setCategoriesParam with empty string for empty array", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    result.current.setSelectedCategories([]);
    expect(mockSetCategoriesParam).toHaveBeenCalledWith("");
  });

  it("should call setDifficultiesParam when setSelectedDifficulties is called", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    result.current.setSelectedDifficulties([
      ProjectDifficulty.EASY,
      ProjectDifficulty.MEDIUM,
    ]);
    expect(mockSetDifficultiesParam).toHaveBeenCalledWith("EASY,MEDIUM");
  });

  it("should call setNewParam when setShowOnlyNew is called", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    result.current.setShowOnlyNew(true);
    expect(mockSetNewParam).toHaveBeenCalledWith("true");

    result.current.setShowOnlyNew(false);
    expect(mockSetNewParam).toHaveBeenCalledWith("");
  });

  it("should call setSortParam when setSort is called", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    result.current.setSort("titleAsc");
    expect(mockSetSortParam).toHaveBeenCalledWith("titleAsc");
  });

  it("should call setSortParam with empty string for default sort", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    result.current.setSort("categoryAsc");
    expect(mockSetSortParam).toHaveBeenCalledWith("");
  });

  it("should validate and serialize sort value", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    result.current.setSort("difficultyDesc");
    expect(mockSetSortParam).toHaveBeenCalledWith("difficultyDesc");
  });

  it("should call all setters when resetFilters is called", () => {
    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    result.current.resetFilters();

    expect(mockSetSearchParam).toHaveBeenCalledWith("");
    expect(mockSetCategoriesParam).toHaveBeenCalledWith("");
    expect(mockSetDifficultiesParam).toHaveBeenCalledWith("");
    expect(mockSetNewParam).toHaveBeenCalledWith("");
    expect(mockSetSortParam).toHaveBeenCalledWith("");
  });
});

describe("ProjectBrowserContext - URL Parameter Parsing", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it("should parse browser param correctly", () => {
    mockUseSearchParam.mockImplementation((param: string) => {
      if (param === "browser") {
        return ["true", mockSetBrowserParam];
      }
      return ["", vi.fn()];
    });

    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("should parse categories param correctly", () => {
    mockUseSearchParam.mockImplementation((param: string) => {
      if (param === "categories") {
        return ["ARRAY,BINARY_TREE", mockSetCategoriesParam];
      }
      return ["", vi.fn()];
    });

    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    expect(result.current.selectedCategories).toEqual([
      ProjectCategory.ARRAY,
      ProjectCategory.BINARY_TREE,
    ]);
  });

  it("should parse difficulties param correctly", () => {
    mockUseSearchParam.mockImplementation((param: string) => {
      if (param === "difficulties") {
        return ["EASY,MEDIUM", mockSetDifficultiesParam];
      }
      return ["", vi.fn()];
    });

    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    expect(result.current.selectedDifficulties).toEqual([
      ProjectDifficulty.EASY,
      ProjectDifficulty.MEDIUM,
    ]);
  });

  it("should parse new param correctly", () => {
    mockUseSearchParam.mockImplementation((param: string) => {
      if (param === "new") {
        return ["true", mockSetNewParam];
      }
      return ["", vi.fn()];
    });

    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    expect(result.current.showOnlyNew).toBe(true);
  });

  it("should parse sort param correctly", () => {
    mockUseSearchParam.mockImplementation((param: string) => {
      if (param === "sort") {
        return ["titleAsc", mockSetSortParam];
      }
      return ["", vi.fn()];
    });

    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    expect(result.current.sortBy).toBe("title");
    expect(result.current.sortOrder).toBe("asc");
  });

  it("should parse sort param with desc order", () => {
    mockUseSearchParam.mockImplementation((param: string) => {
      if (param === "sort") {
        return ["difficultyDesc", mockSetSortParam];
      }
      return ["", vi.fn()];
    });

    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    expect(result.current.sortBy).toBe("difficulty");
    expect(result.current.sortOrder).toBe("desc");
  });

  it("should default to categoryAsc for invalid sort", () => {
    mockUseSearchParam.mockImplementation((param: string) => {
      if (param === "sort") {
        return ["invalid", mockSetSortParam];
      }
      return ["", vi.fn()];
    });

    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    expect(result.current.sortBy).toBe("category");
    expect(result.current.sortOrder).toBe("asc");
  });

  it("should default to categoryAsc for empty sort param", () => {
    mockUseSearchParam.mockImplementation((param: string) => {
      if (param === "sort") {
        return ["", mockSetSortParam];
      }
      return ["", vi.fn()];
    });

    const { result } = renderHook(() => useProjectBrowserContext(), {
      wrapper,
    });

    expect(result.current.sortBy).toBe("category");
    expect(result.current.sortOrder).toBe("asc");
  });
});
