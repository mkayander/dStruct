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

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;

type EditorState = {
  isEditingNodes: boolean;
  isPanning: boolean;
  offsetX: number;
  offsetY: number;
  scale: number;
  nodeDragState: NodeDragState | null;
};

const initialState: EditorState = {
  isEditingNodes: false,
  isPanning: false,
  offsetX: 0,
  offsetY: 0,
  scale: 1,
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
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, action.payload));
    },
    zoomIn: (state) => {
      state.scale = Math.min(MAX_ZOOM, state.scale + ZOOM_STEP);
    },
    zoomOut: (state) => {
      state.scale = Math.max(MIN_ZOOM, state.scale - ZOOM_STEP);
    },
    zoomAtPoint: (
      state,
      action: PayloadAction<{
        clientX: number;
        clientY: number;
        containerLeft: number;
        containerTop: number;
        newScale: number;
      }>,
    ) => {
      const { clientX, clientY, containerLeft, containerTop, newScale } =
        action.payload;
      const clampedScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newScale));
      const contentX = (clientX - containerLeft - state.offsetX) / state.scale;
      const contentY = (clientY - containerTop - state.offsetY) / state.scale;
      state.offsetX = clientX - containerLeft - contentX * clampedScale;
      state.offsetY = clientY - containerTop - contentY * clampedScale;
      state.scale = clampedScale;
    },
    resetView: (state) => {
      state.offsetX = 0;
      state.offsetY = 0;
      state.scale = 1;
      state.isPanning = false;
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
export const selectIsPanning = (state: RootState) => state.editor.isPanning;
export const selectViewerOffsetX = (state: RootState) => state.editor.offsetX;
export const selectViewerOffsetY = (state: RootState) => state.editor.offsetY;
export const selectIsViewCentered = (state: RootState) =>
  state.editor.offsetX === 0 && state.editor.offsetY === 0;
export const selectViewerScale = (state: RootState) => state.editor.scale;
export const selectIsViewAtDefault = (state: RootState) =>
  state.editor.offsetX === 0 &&
  state.editor.offsetY === 0 &&
  state.editor.scale === 1;

export { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP };
