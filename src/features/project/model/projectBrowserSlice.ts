import type { ProjectCategory, ProjectDifficulty } from "@prisma/client";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RouterOutputs } from "#/shared/api";
import type { RootState } from "#/store/makeStore";

type ProjectBrief =
  RouterOutputs["project"]["browseProjects"]["projects"][number];

type ProjectBrowserState = {
  // Filters
  searchQuery: string;
  selectedCategories: ProjectCategory[];
  selectedDifficulties: ProjectDifficulty[];
  showOnlyNew: boolean;
  showOnlyMine: boolean;

  // Sorting
  sortBy: "title" | "difficulty" | "date" | "category";
  sortOrder: "asc" | "desc";

  // UI State
  isOpen: boolean;
  isLoading: boolean;

  // Pagination
  currentPage: number;
  pageSize: number;
  hasMore: boolean;

  // Accumulated projects across pages
  accumulatedProjects: ProjectBrief[];
  lastQueryKey: string; // Track query key to detect filter changes
};

const initialState: ProjectBrowserState = {
  searchQuery: "",
  selectedCategories: [],
  selectedDifficulties: [],
  showOnlyNew: false,
  showOnlyMine: false,
  sortBy: "category",
  sortOrder: "asc",
  isOpen: false,
  isLoading: false,
  currentPage: 1,
  pageSize: 20,
  hasMore: false,
  accumulatedProjects: [],
  lastQueryKey: "",
};

export const projectBrowserSlice = createSlice({
  name: "PROJECT_BROWSER",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page on search
      state.accumulatedProjects = []; // Clear accumulated projects
      state.lastQueryKey = ""; // Reset query key
    },
    setSelectedCategories: (
      state,
      action: PayloadAction<ProjectCategory[]>,
    ) => {
      state.selectedCategories = action.payload;
      state.currentPage = 1;
      state.accumulatedProjects = [];
      state.lastQueryKey = "";
    },
    setSelectedDifficulties: (
      state,
      action: PayloadAction<ProjectDifficulty[]>,
    ) => {
      state.selectedDifficulties = action.payload;
      state.currentPage = 1;
      state.accumulatedProjects = [];
      state.lastQueryKey = "";
    },
    setShowOnlyNew: (state, action: PayloadAction<boolean>) => {
      state.showOnlyNew = action.payload;
      state.currentPage = 1;
      state.accumulatedProjects = [];
      state.lastQueryKey = "";
    },
    setShowOnlyMine: (state, action: PayloadAction<boolean>) => {
      state.showOnlyMine = action.payload;
      state.currentPage = 1;
      state.accumulatedProjects = [];
      state.lastQueryKey = "";
    },
    setSortBy: (
      state,
      action: PayloadAction<ProjectBrowserState["sortBy"]>,
    ) => {
      state.sortBy = action.payload;
      state.currentPage = 1;
      state.accumulatedProjects = [];
      state.lastQueryKey = "";
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
      state.currentPage = 1;
      state.accumulatedProjects = [];
      state.lastQueryKey = "";
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.selectedCategories = [];
      state.selectedDifficulties = [];
      state.showOnlyNew = false;
      state.showOnlyMine = false;
      state.currentPage = 1;
      state.accumulatedProjects = [];
      state.lastQueryKey = "";
    },
    // Actions for managing accumulated projects
    setAccumulatedProjects: (state, action: PayloadAction<ProjectBrief[]>) => {
      state.accumulatedProjects = action.payload;
    },
    appendProjects: (state, action: PayloadAction<ProjectBrief[]>) => {
      // Avoid duplicates by checking IDs
      const existingIds = new Set(state.accumulatedProjects.map((p) => p.id));
      const newProjects = action.payload.filter((p) => !existingIds.has(p.id));
      state.accumulatedProjects = [
        ...state.accumulatedProjects,
        ...newProjects,
      ];
    },
    clearAccumulatedProjects: (state) => {
      state.accumulatedProjects = [];
      state.lastQueryKey = "";
    },
    setLastQueryKey: (state, action: PayloadAction<string>) => {
      state.lastQueryKey = action.payload;
    },
  },
});

/**
 * Selectors
 */
export const selectSearchQuery = (state: RootState) =>
  state.projectBrowser.searchQuery;
export const selectSelectedCategories = (state: RootState) =>
  state.projectBrowser.selectedCategories;
export const selectSelectedDifficulties = (state: RootState) =>
  state.projectBrowser.selectedDifficulties;
export const selectShowOnlyNew = (state: RootState) =>
  state.projectBrowser.showOnlyNew;
export const selectShowOnlyMine = (state: RootState) =>
  state.projectBrowser.showOnlyMine;
export const selectSortBy = (state: RootState) => state.projectBrowser.sortBy;
export const selectSortOrder = (state: RootState) =>
  state.projectBrowser.sortOrder;
export const selectIsOpen = (state: RootState) => state.projectBrowser.isOpen;
export const selectIsLoading = (state: RootState) =>
  state.projectBrowser.isLoading;
export const selectCurrentPage = (state: RootState) =>
  state.projectBrowser.currentPage;
export const selectPageSize = (state: RootState) =>
  state.projectBrowser.pageSize;
export const selectHasMore = (state: RootState) => state.projectBrowser.hasMore;
export const selectAccumulatedProjects = (state: RootState) =>
  state.projectBrowser.accumulatedProjects;
export const selectLastQueryKey = (state: RootState) =>
  state.projectBrowser.lastQueryKey;

export const selectFilters = (state: RootState) => ({
  searchQuery: state.projectBrowser.searchQuery,
  selectedCategories: state.projectBrowser.selectedCategories,
  selectedDifficulties: state.projectBrowser.selectedDifficulties,
  showOnlyNew: state.projectBrowser.showOnlyNew,
  showOnlyMine: state.projectBrowser.showOnlyMine,
});

export const selectSortOptions = (state: RootState) => ({
  sortBy: state.projectBrowser.sortBy,
  sortOrder: state.projectBrowser.sortOrder,
});

export const selectBrowserState = (state: RootState) => state.projectBrowser;
