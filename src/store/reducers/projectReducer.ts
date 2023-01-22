import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '#/store/makeStore';

type ProjectState = {
  currentProjectId: string | null;
  currentCaseId: string | null;
  currentSolutionId: string | null;
};

const initialState: ProjectState = {
  currentProjectId: null,
  currentCaseId: null,
  currentSolutionId: null,
};

export const projectSlice = createSlice({
  name: 'PROJECT',
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
export const selectCurrentProjectId = (state: RootState) =>
  state.project.currentProjectId;
export const selectCurrentCaseId = (state: RootState) =>
  state.project.currentCaseId;
export const selectCurrentSolutionId = (state: RootState) =>
  state.project.currentSolutionId;
