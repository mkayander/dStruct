import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "#/store/makeStore";

export type NodeDragState = {
  treeName: string;
  nodeId: string;
  startX: number;
  startY: number;
  startClientX: number;
  startClientY: number;
};

type EditorState = {
  isEditing: boolean;
  dragState: NodeDragState | null;
};

const initialState: EditorState = {
  isEditing: false,
  dragState: null,
};

export const editorSlice = createSlice({
  name: "EDITOR",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<Partial<EditorState>>) => {
      const { payload } = action;
      return {
        ...state,
        ...payload,
      };
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    startDrag: (state, action: PayloadAction<EditorState["dragState"]>) => {
      state.dragState = action.payload;
    },
    clear: (state) => {
      state.dragState = null;
    },
  },
});

/**
 * Reducer
 */
export const editorReducer = editorSlice.reducer;

/**
 * Selectors
 */
export const selectDragState = (state: RootState) => state.editor.dragState;
export const selectIsEditing = (state: RootState) => state.editor.isEditing;
