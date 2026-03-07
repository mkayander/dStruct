import { describe, expect, it } from "vitest";

import { makeStore } from "#/store/makeStore";

import { benchmarkSlice } from "../benchmarkSlice";

describe("benchmarkSlice", () => {
  const createStore = () => makeStore();

  describe("setProgress", () => {
    it("should set progress when benchmark is running", () => {
      const store = createStore();
      expect(store.getState().benchmark.progress).toBe(null);

      store.dispatch(
        benchmarkSlice.actions.setProgress({ current: 32, total: 128 }),
      );

      expect(store.getState().benchmark.progress).toEqual({
        current: 32,
        total: 128,
      });
    });

    it("should update progress as iterations complete", () => {
      const store = createStore();
      store.dispatch(
        benchmarkSlice.actions.setProgress({ current: 64, total: 128 }),
      );

      store.dispatch(
        benchmarkSlice.actions.setProgress({ current: 128, total: 128 }),
      );

      expect(store.getState().benchmark.progress).toEqual({
        current: 128,
        total: 128,
      });
    });
  });

  describe("clearProgress", () => {
    it("should clear progress when benchmark completes", () => {
      const store = createStore();
      store.dispatch(
        benchmarkSlice.actions.setProgress({ current: 128, total: 128 }),
      );

      store.dispatch(benchmarkSlice.actions.clearProgress());

      expect(store.getState().benchmark.progress).toBe(null);
    });
  });
});
