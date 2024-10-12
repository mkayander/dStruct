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
  isEditingNodes: boolean;
  dragState: NodeDragState | null;
};

const initialState: EditorState = {
  isEditingNodes: false,
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
      state.isEditingNodes = action.payload;
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
export const selectIsEditingNodes = (state: RootState) =>
  state.editor.isEditingNodes;
