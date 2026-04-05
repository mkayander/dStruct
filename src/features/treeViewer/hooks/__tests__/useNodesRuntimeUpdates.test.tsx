import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type {
  CallFrame,
  CallstackState,
} from "#/features/callstack/model/callstackSlice";
import { callstackSlice } from "#/features/callstack/model/callstackSlice";
import type { RootState } from "#/store/makeStore";
import { rootReducer } from "#/store/rootReducer";

import { useNodesRuntimeUpdates } from "../useNodesRuntimeUpdates";

const createMockFrame = (
  id: string,
  nodeId: string,
  value: number,
): CallFrame => ({
  id,
  timestamp: Number(id.replace(/\D/g, "")) || 0,
  name: "setVal",
  treeName: "head",
  nodeId,
  structureType: "treeNode",
  argType: ArgumentType.BINARY_TREE,
  args: { value },
});

const createStoreWithCallstack = (callstack: Partial<CallstackState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      callstack: {
        isReady: true,
        isPlaying: false,
        result: null,
        runtime: null,
        startTimestamp: 0,
        error: null,
        frames: { ids: [], entities: {} },
        frameIndex: -1,
        resetVersion: 0,
        ...callstack,
      },
    } as Partial<RootState>,
  });

const createWrapper =
  (store: ReturnType<typeof createStoreWithCallstack>) =>
  ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

describe("useNodesRuntimeUpdates", () => {
  it("continues autoplay after replay resets the frame index", () => {
    vi.useFakeTimers();

    const frames = [
      createMockFrame("f1", "root", 1),
      createMockFrame("f2", "left", 2),
    ];
    const store = createStoreWithCallstack({
      frames: {
        ids: frames.map((frame) => frame.id),
        entities: Object.fromEntries(frames.map((frame) => [frame.id, frame])),
      },
      frameIndex: 1,
      isPlaying: false,
      resetVersion: 0,
    });

    renderHook(() => useNodesRuntimeUpdates(20), {
      wrapper: createWrapper(store),
    });

    act(() => {
      store.dispatch(callstackSlice.actions.setIsPlaying(false));
      store.dispatch(callstackSlice.actions.setFrameIndex(-1));
      store.dispatch(callstackSlice.actions.markReset());
      store.dispatch(callstackSlice.actions.setIsPlaying(true));
    });

    act(() => {
      vi.advanceTimersByTime(25);
    });

    expect(store.getState().callstack.frameIndex).toBe(0);
    expect(store.getState().callstack.isPlaying).toBe(true);

    vi.useRealTimers();
  });
});
