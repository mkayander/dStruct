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
  nodeDragState: NodeDragState | null;
};

const initialState: EditorState = {
  isEditingNodes: false,
  nodeDragState: null,
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
    reset: () => {
      return initialState;
    },
    startDrag: (state, action: PayloadAction<EditorState["nodeDragState"]>) => {
      state.nodeDragState = action.payload;
    },
    clear: (state) => {
      state.nodeDragState = null;
    },
  },
});

/**
 * Selectors
 */
export const selectNodeDragState = (state: RootState) =>
  state.editor.nodeDragState;
export const selectIsEditingNodes = (state: RootState) =>
  state.editor.isEditingNodes;

export { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from "./editorConstants";
