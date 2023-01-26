import type { PlaygroundTestCase } from '@prisma/client';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '#/store/makeStore';

type ProjectState = {
  currentProjectId: string | null;
  currentCaseId: string | null;
  currentSolutionId: string | null;
  isEditable: boolean;
};

const initialState: ProjectState = {
  currentProjectId: null,
  currentCaseId: null,
  currentSolutionId: null,
  isEditable: false,
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
    setCurrentCase: (
      state,
      action: PayloadAction<PlaygroundTestCase | null>
    ) => {
      const { payload } = action;
      return {
        ...state,
        currentCase: payload && {
          ...payload,
          createdAt: payload.createdAt.toISOString(),
          updatedAt: payload.updatedAt.toISOString(),
        },
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
export const selectIsEditable = (state: RootState) => state.project.isEditable;
