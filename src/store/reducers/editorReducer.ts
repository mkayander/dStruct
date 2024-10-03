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
  dragState: NodeDragState | null;
};

const initialState: EditorState = {
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
    startDrag: (state, action: PayloadAction<EditorState["dragState"]>) => {
      const { payload } = action;
      return {
        ...state,
        dragState: payload,
      };
    },
    clear: () => ({ ...initialState }),
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
