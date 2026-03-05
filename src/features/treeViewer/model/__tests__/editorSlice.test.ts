import { describe, expect, it } from "vitest";

import { makeStore } from "#/store/makeStore";

import {
  editorSlice,
  selectIsEditingNodes,
  selectNodeDragState,
} from "../editorSlice";

describe("editorSlice", () => {
  const createStore = () => makeStore();

  describe("setIsEditing", () => {
    it("should update isEditingNodes", () => {
      const store = createStore();
      expect(selectIsEditingNodes(store.getState())).toBe(false);

      store.dispatch(editorSlice.actions.setIsEditing(true));
      expect(selectIsEditingNodes(store.getState())).toBe(true);
    });
  });

  describe("startDrag and clear", () => {
    it("should set and clear nodeDragState", () => {
      const store = createStore();
      expect(selectNodeDragState(store.getState())).toBe(null);

      const dragState = {
        treeName: "tree",
        nodeId: "1",
        startX: 0,
        startY: 0,
        startClientX: 100,
        startClientY: 100,
      };
      store.dispatch(editorSlice.actions.startDrag(dragState));
      expect(selectNodeDragState(store.getState())).toEqual(dragState);

      store.dispatch(editorSlice.actions.clear());
      expect(selectNodeDragState(store.getState())).toBe(null);
    });
  });

  describe("reset", () => {
    it("should reset to initial state", () => {
      const store = createStore();
      store.dispatch(editorSlice.actions.setIsEditing(true));
      store.dispatch(
        editorSlice.actions.startDrag({
          treeName: "t",
          nodeId: "1",
          startX: 0,
          startY: 0,
          startClientX: 0,
          startClientY: 0,
        }),
      );

      store.dispatch(editorSlice.actions.reset());

      expect(selectIsEditingNodes(store.getState())).toBe(false);
      expect(selectNodeDragState(store.getState())).toBe(null);
    });
  });
});
