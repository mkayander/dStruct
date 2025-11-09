import type { ProjectCategory, ProjectDifficulty } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { makeStore } from "#/store/makeStore";

import {
  projectBrowserSlice,
  selectBrowserState,
  selectCurrentPage,
  selectIsOpen,
  selectSearchQuery,
  selectSelectedCategories,
  selectSelectedDifficulties,
  selectShowOnlyNew,
  selectSortBy,
  selectSortOrder,
} from "../projectBrowserSlice";

describe("projectBrowserSlice", () => {
  const createStore = () => makeStore();

  describe("initial state", () => {
    it("should have correct initial state", () => {
      const store = createStore();
      const state = selectBrowserState(store.getState());

      expect(state.searchQuery).toBe("");
      expect(state.selectedCategories).toEqual([]);
      expect(state.selectedDifficulties).toEqual([]);
      expect(state.showOnlyNew).toBe(false);
      expect(state.showOnlyMine).toBe(false);
      expect(state.sortBy).toBe("category");
      expect(state.sortOrder).toBe("asc");
      expect(state.isOpen).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.currentPage).toBe(1);
      expect(state.pageSize).toBe(20);
      expect(state.hasMore).toBe(false);
    });
  });

  describe("setSearchQuery", () => {
    it("should update search query and reset page to 1", () => {
      const store = createStore();

      // Set page to 2 first
      store.dispatch(projectBrowserSlice.actions.setCurrentPage(2));
      expect(selectCurrentPage(store.getState())).toBe(2);

      // Set search query
      store.dispatch(projectBrowserSlice.actions.setSearchQuery("test query"));

      expect(selectSearchQuery(store.getState())).toBe("test query");
      expect(selectCurrentPage(store.getState())).toBe(1);
    });

    it("should handle empty search query", () => {
      const store = createStore();
      store.dispatch(projectBrowserSlice.actions.setSearchQuery(""));

      expect(selectSearchQuery(store.getState())).toBe("");
    });
  });

  describe("setSelectedCategories", () => {
    it("should update selected categories and reset page to 1", () => {
      const store = createStore();
      const categories: ProjectCategory[] = ["ARRAY", "BINARY_TREE"];

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(3));
      store.dispatch(
        projectBrowserSlice.actions.setSelectedCategories(categories),
      );

      expect(selectSelectedCategories(store.getState())).toEqual(categories);
      expect(selectCurrentPage(store.getState())).toBe(1);
    });

    it("should handle empty categories array", () => {
      const store = createStore();
      store.dispatch(projectBrowserSlice.actions.setSelectedCategories([]));

      expect(selectSelectedCategories(store.getState())).toEqual([]);
    });
  });

  describe("setSelectedDifficulties", () => {
    it("should update selected difficulties and reset page to 1", () => {
      const store = createStore();
      const difficulties: ProjectDifficulty[] = ["EASY", "MEDIUM"];

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(2));
      store.dispatch(
        projectBrowserSlice.actions.setSelectedDifficulties(difficulties),
      );

      expect(selectSelectedDifficulties(store.getState())).toEqual(
        difficulties,
      );
      expect(selectCurrentPage(store.getState())).toBe(1);
    });
  });

  describe("setShowOnlyNew", () => {
    it("should update showOnlyNew and reset page to 1", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(2));
      store.dispatch(projectBrowserSlice.actions.setShowOnlyNew(true));

      expect(selectShowOnlyNew(store.getState())).toBe(true);
      expect(selectCurrentPage(store.getState())).toBe(1);
    });

    it("should handle false value", () => {
      const store = createStore();
      store.dispatch(projectBrowserSlice.actions.setShowOnlyNew(true));
      store.dispatch(projectBrowserSlice.actions.setShowOnlyNew(false));

      expect(selectShowOnlyNew(store.getState())).toBe(false);
    });
  });

  describe("setSortBy", () => {
    it("should update sortBy and reset page to 1", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(2));
      store.dispatch(projectBrowserSlice.actions.setSortBy("title"));

      expect(selectSortBy(store.getState())).toBe("title");
      expect(selectCurrentPage(store.getState())).toBe(1);
    });

    it("should handle all sort options", () => {
      const store = createStore();
      const sortOptions: Array<"title" | "difficulty" | "date" | "category"> = [
        "title",
        "difficulty",
        "date",
        "category",
      ];

      sortOptions.forEach((option) => {
        store.dispatch(projectBrowserSlice.actions.setSortBy(option));
        expect(selectSortBy(store.getState())).toBe(option);
      });
    });
  });

  describe("setSortOrder", () => {
    it("should update sortOrder and reset page to 1", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(2));
      store.dispatch(projectBrowserSlice.actions.setSortOrder("desc"));

      expect(selectSortOrder(store.getState())).toBe("desc");
      expect(selectCurrentPage(store.getState())).toBe(1);
    });

    it("should handle asc order", () => {
      const store = createStore();
      store.dispatch(projectBrowserSlice.actions.setSortOrder("desc"));
      store.dispatch(projectBrowserSlice.actions.setSortOrder("asc"));

      expect(selectSortOrder(store.getState())).toBe("asc");
    });
  });

  describe("setIsOpen", () => {
    it("should update isOpen state", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setIsOpen(true));
      expect(selectIsOpen(store.getState())).toBe(true);

      store.dispatch(projectBrowserSlice.actions.setIsOpen(false));
      expect(selectIsOpen(store.getState())).toBe(false);
    });
  });

  describe("setIsLoading", () => {
    it("should update isLoading state", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setIsLoading(true));
      expect(selectBrowserState(store.getState()).isLoading).toBe(true);

      store.dispatch(projectBrowserSlice.actions.setIsLoading(false));
      expect(selectBrowserState(store.getState()).isLoading).toBe(false);
    });
  });

  describe("setCurrentPage", () => {
    it("should update currentPage", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(2));
      expect(selectCurrentPage(store.getState())).toBe(2);

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(5));
      expect(selectCurrentPage(store.getState())).toBe(5);
    });
  });

  describe("setHasMore", () => {
    it("should update hasMore state", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setHasMore(true));
      expect(selectBrowserState(store.getState()).hasMore).toBe(true);

      store.dispatch(projectBrowserSlice.actions.setHasMore(false));
      expect(selectBrowserState(store.getState()).hasMore).toBe(false);
    });
  });

  describe("resetFilters", () => {
    it("should reset all filter-related state to initial values", () => {
      const store = createStore();

      // Set some filter state
      store.dispatch(projectBrowserSlice.actions.setSearchQuery("test"));
      store.dispatch(
        projectBrowserSlice.actions.setSelectedCategories(["ARRAY"]),
      );
      store.dispatch(
        projectBrowserSlice.actions.setSelectedDifficulties(["EASY"]),
      );
      store.dispatch(projectBrowserSlice.actions.setShowOnlyNew(true));
      store.dispatch(projectBrowserSlice.actions.setCurrentPage(3));

      // Reset filters
      store.dispatch(projectBrowserSlice.actions.resetFilters());

      const state = selectBrowserState(store.getState());
      expect(state.searchQuery).toBe("");
      expect(state.selectedCategories).toEqual([]);
      expect(state.selectedDifficulties).toEqual([]);
      expect(state.showOnlyNew).toBe(false);
      expect(state.currentPage).toBe(1);
      // Should not reset showOnlyMine (it's not in resetFilters)
      // Should not reset sort options
    });
  });

  describe("filter state interactions", () => {
    it("should reset page when any filter changes", () => {
      const store = createStore();

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(5));

      // Change search
      store.dispatch(projectBrowserSlice.actions.setSearchQuery("test"));
      expect(selectCurrentPage(store.getState())).toBe(1);

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(5));

      // Change categories
      store.dispatch(
        projectBrowserSlice.actions.setSelectedCategories(["ARRAY"]),
      );
      expect(selectCurrentPage(store.getState())).toBe(1);

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(5));

      // Change difficulties
      store.dispatch(
        projectBrowserSlice.actions.setSelectedDifficulties(["EASY"]),
      );
      expect(selectCurrentPage(store.getState())).toBe(1);

      store.dispatch(projectBrowserSlice.actions.setCurrentPage(5));

      // Change showOnlyNew
      store.dispatch(projectBrowserSlice.actions.setShowOnlyNew(true));
      expect(selectCurrentPage(store.getState())).toBe(1);
    });
  });
});
