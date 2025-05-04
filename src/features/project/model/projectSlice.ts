import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "#/store/makeStore";

type ProjectState = {
  projectId: string | null;
  isInitialized: boolean;
  isEditable: boolean;
};

const initialState: ProjectState = {
  projectId: null,
  isInitialized: false,
  isEditable: false,
};

export const projectSlice = createSlice({
  name: "PROJECT",
  initialState,
  reducers: {
    loadStart: (state) => {
      state.isInitialized = false;
    },
    loadFinish: (state) => {
      state.isInitialized = true;
    },
    changeProjectId: (state, action: PayloadAction<string>) => {
      state.projectId = action.payload;
    },
    changeIsEditable: (state, action: PayloadAction<boolean>) => {
      state.isEditable = action.payload;
    },
    clear: () => ({ ...initialState }),
  },
});

/**
 * Selectors
 */
export const selectIsInitialized = (state: RootState) =>
  state.project.isInitialized;
export const selectIsEditable = (state: RootState) => state.project.isEditable;
export const selectProjectId = (state: RootState) => state.project.projectId;
