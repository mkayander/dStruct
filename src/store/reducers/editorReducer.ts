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
  isPanning: boolean;
  offsetX: number;
  offsetY: number;
  nodeDragState: NodeDragState | null;
};

const initialState: EditorState = {
  isEditingNodes: false,
  isPanning: false,
  offsetX: 0,
  offsetY: 0,
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
    setIsPanning: (state, action: PayloadAction<boolean>) => {
      state.isPanning = action.payload;
    },
    panView: (
      state,
      action: PayloadAction<Pick<EditorState, "offsetX" | "offsetY">>,
    ) => {
      state.offsetX += action.payload.offsetX;
      state.offsetY += action.payload.offsetY;
    },
    resetViewOffset: (state) => {
      state.offsetX = 0;
      state.offsetY = 0;
      state.isPanning = false;
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
 * Reducer
 */
export const editorReducer = editorSlice.reducer;

/**
 * Selectors
 */
export const selectNodeDragState = (state: RootState) =>
  state.editor.nodeDragState;
export const selectIsEditingNodes = (state: RootState) =>
  state.editor.isEditingNodes;
export const selectIsPanning = (state: RootState) => state.editor.isPanning;
export const selectViewerOffsetX = (state: RootState) => state.editor.offsetX;
export const selectViewerOffsetY = (state: RootState) => state.editor.offsetY;
