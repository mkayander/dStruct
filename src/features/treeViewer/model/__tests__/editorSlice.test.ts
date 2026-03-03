import { describe, expect, it } from "vitest";

import { makeStore } from "#/store/makeStore";

import {
  editorSlice,
  MAX_ZOOM,
  MIN_ZOOM,
  selectIsViewAtDefault,
  selectViewerOffsetX,
  selectViewerOffsetY,
  selectViewerScale,
} from "../editorSlice";

describe("editorSlice", () => {
  const createStore = () => makeStore();

  describe("zoomIn", () => {
    it("should increase scale by ZOOM_STEP", () => {
      const store = createStore();
      expect(selectViewerScale(store.getState())).toBe(1);

      store.dispatch(editorSlice.actions.zoomIn());
      expect(selectViewerScale(store.getState())).toBe(1.25);

      store.dispatch(editorSlice.actions.zoomIn());
      expect(selectViewerScale(store.getState())).toBe(1.5);
    });

    it("should clamp at MAX_ZOOM", () => {
      const store = createStore();
      for (let i = 0; i < 20; i++) {
        store.dispatch(editorSlice.actions.zoomIn());
      }
      expect(selectViewerScale(store.getState())).toBe(MAX_ZOOM);
    });
  });

  describe("zoomOut", () => {
    it("should decrease scale by ZOOM_STEP", () => {
      const store = createStore();
      store.dispatch(editorSlice.actions.zoomOut());
      expect(selectViewerScale(store.getState())).toBe(0.75);

      store.dispatch(editorSlice.actions.zoomOut());
      expect(selectViewerScale(store.getState())).toBe(0.5);
    });

    it("should clamp at MIN_ZOOM", () => {
      const store = createStore();
      for (let i = 0; i < 20; i++) {
        store.dispatch(editorSlice.actions.zoomOut());
      }
      expect(selectViewerScale(store.getState())).toBe(MIN_ZOOM);
    });
  });

  describe("zoomAtPoint", () => {
    it("should update scale and offset to keep point fixed", () => {
      const store = createStore();
      const containerLeft = 100;
      const containerTop = 50;
      const clientX = 200;
      const clientY = 100;

      store.dispatch(
        editorSlice.actions.zoomAtPoint({
          clientX,
          clientY,
          containerLeft,
          containerTop,
          newScale: 2,
        }),
      );

      expect(selectViewerScale(store.getState())).toBe(2);
      const offsetX = selectViewerOffsetX(store.getState());
      const offsetY = selectViewerOffsetY(store.getState());
      expect(offsetX).not.toBe(0);
      expect(offsetY).not.toBe(0);
    });

    it("should clamp scale to valid range", () => {
      const store = createStore();
      store.dispatch(
        editorSlice.actions.zoomAtPoint({
          clientX: 100,
          clientY: 100,
          containerLeft: 0,
          containerTop: 0,
          newScale: 10,
        }),
      );
      expect(selectViewerScale(store.getState())).toBe(MAX_ZOOM);

      store.dispatch(
        editorSlice.actions.zoomAtPoint({
          clientX: 100,
          clientY: 100,
          containerLeft: 0,
          containerTop: 0,
          newScale: 0.1,
        }),
      );
      expect(selectViewerScale(store.getState())).toBe(MIN_ZOOM);
    });
  });

  describe("panView", () => {
    it("should accumulate offset", () => {
      const store = createStore();

      store.dispatch(editorSlice.actions.panView({ offsetX: 10, offsetY: 5 }));
      expect(selectViewerOffsetX(store.getState())).toBe(10);
      expect(selectViewerOffsetY(store.getState())).toBe(5);

      store.dispatch(editorSlice.actions.panView({ offsetX: -3, offsetY: 2 }));
      expect(selectViewerOffsetX(store.getState())).toBe(7);
      expect(selectViewerOffsetY(store.getState())).toBe(7);
    });
  });

  describe("resetView", () => {
    it("should reset offset and scale to default", () => {
      const store = createStore();
      store.dispatch(editorSlice.actions.panView({ offsetX: 50, offsetY: 30 }));
      store.dispatch(editorSlice.actions.zoomIn());

      store.dispatch(editorSlice.actions.resetView());

      expect(selectViewerOffsetX(store.getState())).toBe(0);
      expect(selectViewerOffsetY(store.getState())).toBe(0);
      expect(selectViewerScale(store.getState())).toBe(1);
      expect(selectIsViewAtDefault(store.getState())).toBe(true);
    });
  });

  describe("setScale", () => {
    it("should clamp scale to valid range", () => {
      const store = createStore();

      store.dispatch(editorSlice.actions.setScale(10));
      expect(selectViewerScale(store.getState())).toBe(MAX_ZOOM);

      store.dispatch(editorSlice.actions.setScale(0.1));
      expect(selectViewerScale(store.getState())).toBe(MIN_ZOOM);

      store.dispatch(editorSlice.actions.setScale(1.5));
      expect(selectViewerScale(store.getState())).toBe(1.5);
    });
  });

  describe("selectIsViewAtDefault", () => {
    it("should be true when offset and scale are at default", () => {
      const store = createStore();
      expect(selectIsViewAtDefault(store.getState())).toBe(true);
    });

    it("should be false when panned", () => {
      const store = createStore();
      store.dispatch(editorSlice.actions.panView({ offsetX: 1, offsetY: 0 }));
      expect(selectIsViewAtDefault(store.getState())).toBe(false);
    });

    it("should be false when zoomed", () => {
      const store = createStore();
      store.dispatch(editorSlice.actions.zoomIn());
      expect(selectIsViewAtDefault(store.getState())).toBe(false);
    });
  });
});
