import { describe, expect, it } from "vitest";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { makeStore } from "#/store/makeStore";

import { callstackSlice, selectPlaybackSourceLine } from "../callstackSlice";

describe("callstackSlice", () => {
  it("increments resetVersion when a reset is marked", () => {
    const state = callstackSlice.reducer(
      undefined,
      callstackSlice.actions.markReset(),
    );

    expect(state.resetVersion).toBe(1);
  });

  it("selectPlaybackSourceLine walks back to the nearest frame with source", () => {
    const store = makeStore();
    store.dispatch(
      callstackSlice.actions.setStatus({
        isReady: true,
        error: null,
        result: "",
        runtime: 1,
        startTimestamp: 0,
        frames: [
          {
            id: "a",
            timestamp: 0,
            treeName: "main",
            structureType: "treeNode",
            argType: ArgumentType.BINARY_TREE,
            nodeId: "n1",
            name: "blink",
            source: { line: 5 },
          },
          {
            id: "b",
            timestamp: 1,
            treeName: "main",
            structureType: "treeNode",
            argType: ArgumentType.BINARY_TREE,
            nodeId: "n1",
            name: "setColor",
            args: { color: "red" },
          },
        ],
        lastRunCodeSource: "same",
        codeModifiedSinceRun: false,
      }),
    );
    store.dispatch(callstackSlice.actions.setFrameIndex(1));
    expect(selectPlaybackSourceLine(store.getState())).toBe(5);
  });

  it("selectPlaybackSourceLine is null when codeModifiedSinceRun", () => {
    const store = makeStore();
    store.dispatch(
      callstackSlice.actions.setStatus({
        isReady: true,
        error: null,
        result: "",
        runtime: 1,
        startTimestamp: 0,
        frames: [
          {
            id: "a",
            timestamp: 0,
            treeName: "main",
            structureType: "treeNode",
            argType: ArgumentType.BINARY_TREE,
            nodeId: "n1",
            name: "blink",
            source: { line: 2 },
          },
        ],
        lastRunCodeSource: "x",
        codeModifiedSinceRun: false,
      }),
    );
    store.dispatch(callstackSlice.actions.setFrameIndex(0));
    store.dispatch(callstackSlice.actions.markCodeSnapshotStale());
    expect(selectPlaybackSourceLine(store.getState())).toBeNull();
  });
});
