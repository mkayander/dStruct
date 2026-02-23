import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RouterOutputs } from "#/shared/api";
import type { RootState } from "#/store/makeStore";

export type ProjectBrief =
  RouterOutputs["project"]["browseProjects"]["projects"][number];

type ProjectBrowserState = {
  // UI State
  isLoading: boolean;

  // Pagination
  currentPage: number;
  pageSize: number;
  hasMore: boolean;

  // Accumulated projects across pages (API returns serializable createdAt as ISO string)
  accumulatedProjects: ProjectBrief[];
  lastQueryKey: string; // Track query key to detect filter changes
};

const initialState: ProjectBrowserState = {
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
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
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
