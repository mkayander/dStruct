import { describe, expect, it } from "vitest";

import {
  ProjectCategory,
  ProjectDifficulty,
} from "#/server/db/generated/enums";

/**
 * Tests for queryKey generation logic used in ProjectBrowser
 * This tests the business logic for creating stable query keys based on filters
 */
describe("ProjectBrowser - QueryKey Generation Logic", () => {
  const generateQueryKey = (params: {
    pageSize: number;
    searchQuery: string;
    selectedCategories: ProjectCategory[];
    selectedDifficulties: ProjectDifficulty[];
    showOnlyNew: boolean;
    sortBy: "title" | "difficulty" | "date" | "category";
    sortOrder: "asc" | "desc";
  }) => {
    return JSON.stringify({
      pageSize: params.pageSize,
      search: params.searchQuery.trim() || undefined,
      categories:
        params.selectedCategories.length > 0
          ? params.selectedCategories
          : undefined,
      difficulties:
        params.selectedDifficulties.length > 0
          ? params.selectedDifficulties
          : undefined,
      showOnlyNew: params.showOnlyNew || undefined,
      showOnlyMine: false,
      sortBy: params.sortBy === "date" ? "createdAt" : params.sortBy,
      sortOrder: params.sortOrder,
    });
  };

  describe("queryKey generation", () => {
    it("should generate same key for identical filters", () => {
      const params1 = {
        pageSize: 20,
        searchQuery: "test",
        selectedCategories: [ProjectCategory.ARRAY],
        selectedDifficulties: [ProjectDifficulty.EASY],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const params2 = { ...params1 };

      expect(generateQueryKey(params1)).toBe(generateQueryKey(params2));
    });

    it("should generate different key when search changes", () => {
      const baseParams = {
        pageSize: 20,
        searchQuery: "test",
        selectedCategories: [] as ProjectCategory[],
        selectedDifficulties: [] as ProjectDifficulty[],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const key1 = generateQueryKey(baseParams);
      const key2 = generateQueryKey({ ...baseParams, searchQuery: "other" });

      expect(key1).not.toBe(key2);
    });

    it("should generate different key when categories change", () => {
      const baseParams = {
        pageSize: 20,
        searchQuery: "",
        selectedCategories: [] as ProjectCategory[],
        selectedDifficulties: [] as ProjectDifficulty[],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const key1 = generateQueryKey(baseParams);
      const key2 = generateQueryKey({
        ...baseParams,
        selectedCategories: [ProjectCategory.ARRAY],
      });

      expect(key1).not.toBe(key2);
    });

    it("should generate different key when difficulties change", () => {
      const baseParams = {
        pageSize: 20,
        searchQuery: "",
        selectedCategories: [] as ProjectCategory[],
        selectedDifficulties: [] as ProjectDifficulty[],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const key1 = generateQueryKey(baseParams);
      const key2 = generateQueryKey({
        ...baseParams,
        selectedDifficulties: [ProjectDifficulty.EASY],
      });

      expect(key1).not.toBe(key2);
    });

    it("should generate different key when showOnlyNew changes", () => {
      const baseParams = {
        pageSize: 20,
        searchQuery: "",
        selectedCategories: [] as ProjectCategory[],
        selectedDifficulties: [] as ProjectDifficulty[],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const key1 = generateQueryKey(baseParams);
      const key2 = generateQueryKey({ ...baseParams, showOnlyNew: true });

      expect(key1).not.toBe(key2);
    });

    it("should generate different key when sortBy changes", () => {
      const baseParams = {
        pageSize: 20,
        searchQuery: "",
        selectedCategories: [] as ProjectCategory[],
        selectedDifficulties: [] as ProjectDifficulty[],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const key1 = generateQueryKey(baseParams);
      const key2 = generateQueryKey({ ...baseParams, sortBy: "difficulty" });

      expect(key1).not.toBe(key2);
    });

    it("should generate different key when sortOrder changes", () => {
      const baseParams = {
        pageSize: 20,
        searchQuery: "",
        selectedCategories: [] as ProjectCategory[],
        selectedDifficulties: [] as ProjectDifficulty[],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const key1 = generateQueryKey(baseParams);
      const key2 = generateQueryKey({ ...baseParams, sortOrder: "desc" });

      expect(key1).not.toBe(key2);
    });

    it("should convert 'date' sortBy to 'createdAt'", () => {
      const params = {
        pageSize: 20,
        searchQuery: "",
        selectedCategories: [] as ProjectCategory[],
        selectedDifficulties: [] as ProjectDifficulty[],
        showOnlyNew: false,
        sortBy: "date" as const,
        sortOrder: "asc" as const,
      };

      const key = generateQueryKey(params);
      const parsed = JSON.parse(key);

      expect(parsed.sortBy).toBe("createdAt");
    });

    it("should trim search query", () => {
      const params1 = {
        pageSize: 20,
        searchQuery: "test",
        selectedCategories: [] as ProjectCategory[],
        selectedDifficulties: [] as ProjectDifficulty[],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const params2 = {
        ...params1,
        searchQuery: "  test  ",
      };

      expect(generateQueryKey(params1)).toBe(generateQueryKey(params2));
    });

    it("should treat empty trimmed search as undefined", () => {
      const params = {
        pageSize: 20,
        searchQuery: "   ",
        selectedCategories: [] as ProjectCategory[],
        selectedDifficulties: [] as ProjectDifficulty[],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const key = generateQueryKey(params);
      const parsed = JSON.parse(key);

      expect(parsed.search).toBeUndefined();
    });

    it("should treat empty arrays as undefined", () => {
      const params = {
        pageSize: 20,
        searchQuery: "",
        selectedCategories: [] as ProjectCategory[],
        selectedDifficulties: [] as ProjectDifficulty[],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const key = generateQueryKey(params);
      const parsed = JSON.parse(key);

      expect(parsed.categories).toBeUndefined();
      expect(parsed.difficulties).toBeUndefined();
    });

    it("should treat false showOnlyNew as undefined", () => {
      const params = {
        pageSize: 20,
        searchQuery: "",
        selectedCategories: [] as ProjectCategory[],
        selectedDifficulties: [] as ProjectDifficulty[],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const key = generateQueryKey(params);
      const parsed = JSON.parse(key);

      expect(parsed.showOnlyNew).toBeUndefined();
    });

    it("should include pageSize in key", () => {
      const params1 = {
        pageSize: 20,
        searchQuery: "",
        selectedCategories: [] as ProjectCategory[],
        selectedDifficulties: [] as ProjectDifficulty[],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const params2 = {
        ...params1,
        pageSize: 50,
      };

      const key1 = generateQueryKey(params1);
      const key2 = generateQueryKey(params2);

      expect(key1).not.toBe(key2);
    });

    it("should handle multiple categories", () => {
      const params = {
        pageSize: 20,
        searchQuery: "",
        selectedCategories: [
          ProjectCategory.ARRAY,
          ProjectCategory.BINARY_TREE,
        ],
        selectedDifficulties: [] as ProjectDifficulty[],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const key = generateQueryKey(params);
      const parsed = JSON.parse(key);

      expect(parsed.categories).toEqual([
        ProjectCategory.ARRAY,
        ProjectCategory.BINARY_TREE,
      ]);
    });

    it("should handle multiple difficulties", () => {
      const params = {
        pageSize: 20,
        searchQuery: "",
        selectedCategories: [] as ProjectCategory[],
        selectedDifficulties: [
          ProjectDifficulty.EASY,
          ProjectDifficulty.MEDIUM,
        ],
        showOnlyNew: false,
        sortBy: "title" as const,
        sortOrder: "asc" as const,
      };

      const key = generateQueryKey(params);
      const parsed = JSON.parse(key);

      expect(parsed.difficulties).toEqual([
        ProjectDifficulty.EASY,
        ProjectDifficulty.MEDIUM,
      ]);
    });
  });
});
