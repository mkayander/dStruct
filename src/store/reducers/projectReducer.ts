import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "#/store/makeStore";

type ProjectState = {
  isEditable: boolean;
};

const initialState: ProjectState = {
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
    setProject: (
      state,
      action: PayloadAction<{ id: string; isEditable?: boolean }>
    ) => {
      const {
        payload: { id, isEditable = false },
      } = action;
      return {
        ...initialState,
        currentProjectId: id,
        isEditable,
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
