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

import { usePlayerControls } from "../usePlayerControls";

const { resetStructuresStateMock } = vi.hoisted(() => ({
  resetStructuresStateMock: vi.fn(),
}));

vi.mock("#/features/treeViewer/lib", async (importOriginal) => {
  const actual = await importOriginal();
  return Object.assign({}, actual, {
    resetStructuresState: resetStructuresStateMock,
  });
});

const createMockFrame = (
  id: string,
  name: "setLeftChild" | "setRightChild" | "setVal" | "setColor" | "blink",
  nodeId: string,
): CallFrame => {
  if (name === "setVal") {
    return {
      id,
      timestamp: Number(id.replace(/\D/g, "")) || 0,
      name,
      treeName: "head",
      nodeId,
      structureType: "treeNode",
      argType: ArgumentType.BINARY_TREE,
      args: { value: 1 },
    };
  }

  if (name === "setColor") {
    return {
      id,
      timestamp: Number(id.replace(/\D/g, "")) || 0,
      name,
      treeName: "head",
      nodeId,
      structureType: "treeNode",
      argType: ArgumentType.BINARY_TREE,
      args: { color: "green", animation: "blink" },
    };
  }

  if (name === "blink") {
    return {
      id,
      timestamp: Number(id.replace(/\D/g, "")) || 0,
      name,
      treeName: "head",
      nodeId,
      structureType: "treeNode",
      argType: ArgumentType.BINARY_TREE,
    };
  }

  return {
    id,
    timestamp: Number(id.replace(/\D/g, "")) || 0,
    name,
    treeName: "head",
    nodeId,
    structureType: "treeNode",
    argType: ArgumentType.BINARY_TREE,
    args: {
      childId: `${nodeId}-${name}`,
      childTreeName: "head",
    },
  };
};

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
        ...callstack,
      },
    } as Partial<RootState>,
  });

const createWrapper =
  (store: ReturnType<typeof createStoreWithCallstack>) =>
  ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

describe("usePlayerControls", () => {
  it("increments replayCount for repeated replay calls in the same update", () => {
    const { result } = renderHook(() => usePlayerControls(), {
      wrapper: createWrapper(createStoreWithCallstack({})),
    });

    act(() => {
      result.current.handleReplay();
      result.current.handleReplay();
    });

    expect(result.current.replayCount).toBe(2);
    expect(resetStructuresStateMock).toHaveBeenCalledTimes(2);
    expect(resetStructuresStateMock).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      false,
    );
    expect(resetStructuresStateMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      false,
    );
  });

  it("steps over sibling child swap pairs as one visual transition", () => {
    const frames = [
      createMockFrame("f1", "setVal", "root"),
      createMockFrame("f2", "setLeftChild", "root"),
      createMockFrame("f3", "setLeftChild", "child"),
      createMockFrame("f4", "setColor", "root"),
      createMockFrame("f5", "setRightChild", "root"),
      createMockFrame("f6", "setVal", "left"),
    ];
    const store = createStoreWithCallstack({
      frames: {
        ids: frames.map((frame) => frame.id),
        entities: Object.fromEntries(frames.map((frame) => [frame.id, frame])),
      },
      frameIndex: 0,
    });
    const { result } = renderHook(() => usePlayerControls(), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current.handleStepForward();
    });

    expect(store.getState().callstack.frameIndex).toBe(4);

    act(() => {
      result.current.handleStepBack();
    });

    expect(store.getState().callstack.frameIndex).toBe(0);
  });

  it("uses the latest store state when a previously captured play handler is called", () => {
    const frames = [
      createMockFrame("f1", "setVal", "root"),
      createMockFrame("f2", "setVal", "left"),
    ];
    const store = createStoreWithCallstack({
      frames: {
        ids: frames.map((frame) => frame.id),
        entities: Object.fromEntries(frames.map((frame) => [frame.id, frame])),
      },
      frameIndex: 1,
      isPlaying: false,
    });
    const { result } = renderHook(() => usePlayerControls(), {
      wrapper: createWrapper(store),
    });

    const staleHandlePlay = result.current.handlePlay;

    act(() => {
      store.dispatch(callstackSlice.actions.setFrameIndex(-1));
    });

    act(() => {
      staleHandlePlay();
    });

    expect(store.getState().callstack.isPlaying).toBe(true);
  });
});
