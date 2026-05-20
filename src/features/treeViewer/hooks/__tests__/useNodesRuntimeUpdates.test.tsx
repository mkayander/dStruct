import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import {
  getEdgeId,
  treeNodeSlice,
} from "#/entities/dataStructures/node/model/nodeSlice";
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

const createStoreWithCallstack = (
  callstack: Partial<CallstackState>,
  extraPreloaded?: Partial<RootState>,
) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...extraPreloaded,
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
        lastRunCodeSource: null,
        codeModifiedSinceRun: false,
        ...callstack,
      },
    } as Partial<RootState>,
  });

const seedCrossTreeForPlayback = (parentTree: string, childTree: string) => {
  type TreeAction = ReturnType<
    (typeof treeNodeSlice.actions)[keyof typeof treeNodeSlice.actions]
  >;
  let treeState: RootState["treeNode"] | undefined;
  const reduce = (action: TreeAction) => {
    treeState = treeNodeSlice.reducer(treeState, action);
  };

  reduce(
    treeNodeSlice.actions.init({
      name: parentTree,
      type: ArgumentType.BINARY_TREE,
      order: 0,
    }),
  );
  reduce(
    treeNodeSlice.actions.init({
      name: childTree,
      type: ArgumentType.BINARY_TREE,
      order: 1,
    }),
  );
  reduce(
    treeNodeSlice.actions.addMany({
      name: parentTree,
      data: {
        maxDepth: 0,
        nodes: [
          {
            id: "root",
            value: 3,
            argType: ArgumentType.BINARY_TREE,
            depth: 0,
            x: 0,
            y: 0,
            childrenIds: [],
          },
        ],
      },
    }),
  );
  reduce(
    treeNodeSlice.actions.addMany({
      name: childTree,
      data: {
        maxDepth: 0,
        nodes: [
          {
            id: "subroot",
            value: 20,
            argType: ArgumentType.BINARY_TREE,
            depth: 0,
            x: 0,
            y: 0,
            childrenIds: ["leafL", "leafR"],
          },
          {
            id: "leafL",
            value: 15,
            argType: ArgumentType.BINARY_TREE,
            depth: 0,
            x: 0,
            y: 0,
            childrenIds: [],
          },
          {
            id: "leafR",
            value: 7,
            argType: ArgumentType.BINARY_TREE,
            depth: 0,
            x: 0,
            y: 0,
            childrenIds: [],
          },
        ],
      },
    }),
  );
  reduce(
    treeNodeSlice.actions.addManyEdges({
      name: childTree,
      data: [
        {
          id: getEdgeId("subroot", "leafL"),
          sourceId: "subroot",
          targetId: "leafL",
          isDirected: false,
        },
        {
          id: getEdgeId("subroot", "leafR"),
          sourceId: "subroot",
          targetId: "leafR",
          isDirected: false,
        },
      ],
    }),
  );

  return treeState ?? {};
};

const createWrapper =
  (store: ReturnType<typeof createStoreWithCallstack>) =>
  ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

describe("useNodesRuntimeUpdates", () => {
  it("reverting setRightChild after cross-tree attach restores subtree to the child bucket", () => {
    const parentTree = "parentRuntime";
    const childTree = "childRuntime";

    const store = createStoreWithCallstack(
      {
        frames: {
          ids: ["attachRight"],
          entities: {
            attachRight: {
              id: "attachRight",
              timestamp: 1,
              name: "setRightChild",
              treeName: parentTree,
              nodeId: "root",
              structureType: "treeNode",
              argType: ArgumentType.BINARY_TREE,
              args: {
                childId: "subroot",
                childTreeName: childTree,
              },
              prevArgs: { childId: null, childTreeName: undefined },
            } satisfies CallFrame,
          },
        },
        frameIndex: -1,
      },
      { treeNode: seedCrossTreeForPlayback(parentTree, childTree) },
    );

    renderHook(() => useNodesRuntimeUpdates(20), {
      wrapper: createWrapper(store),
    });

    act(() => {
      store.dispatch(callstackSlice.actions.setFrameIndex(0));
    });

    const afterAttach = store.getState().treeNode[parentTree];
    expect(afterAttach?.nodes.ids).toHaveLength(4);

    act(() => {
      store.dispatch(callstackSlice.actions.setFrameIndex(-1));
    });

    const parent = store.getState().treeNode[parentTree];
    const restored = store.getState().treeNode[childTree];
    expect(parent?.nodes.ids).toEqual(["root"]);
    expect(restored?.nodes.ids).toHaveLength(3);
    expect(restored?.edges.ids).toHaveLength(2);
  });

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
