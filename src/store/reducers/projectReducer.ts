import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "#/store/makeStore";

type ProjectState = {
  isEditable: boolean;
  projectId: string | null;
};

const initialState: ProjectState = {
  projectId: null,
  isEditable: false,
};

export const projectSlice = createSlice({
  name: "PROJECT",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<Partial<ProjectState>>) => {
      const { payload } = action;
      return {
        ...state,
        ...payload,
      };
    },
    clear: () => ({ ...initialState }),
  },
});

/**
 * Reducer
 */
export const projectReducer = projectSlice.reducer;

/**
 * Selectors
 */
export const selectIsEditable = (state: RootState) => state.project.isEditable;
export const selectProjectId = (state: RootState) => state.project.projectId;
