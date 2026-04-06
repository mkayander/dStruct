import { describe, expect, it } from "vitest";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { CallFrame } from "#/features/callstack/model/callstackSlice";

import {
  getLastRenderableFrameIndex,
  getNextPlaybackFrameIndex,
  getPlaybackStepGroups,
  getPlaybackStepIndex,
  getPreviousPlaybackFrameIndex,
} from "../playbackBatching";

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

describe("playbackBatching", () => {
  it("batches adjacent left/right child updates for the same parent", () => {
    const frames = [
      createMockFrame("f1", "setVal", "root"),
      createMockFrame("f2", "setLeftChild", "root"),
      createMockFrame("f3", "setRightChild", "root"),
      createMockFrame("f4", "setVal", "left"),
    ];

    expect(getNextPlaybackFrameIndex(frames, 0)).toBe(2);
    expect(getPreviousPlaybackFrameIndex(frames, 2)).toBe(0);
  });

  it("does not batch child updates from different parents", () => {
    const frames = [
      createMockFrame("f1", "setVal", "root"),
      createMockFrame("f2", "setLeftChild", "root"),
      createMockFrame("f3", "setRightChild", "other"),
    ];

    expect(getNextPlaybackFrameIndex(frames, 0)).toBe(1);
    expect(getPreviousPlaybackFrameIndex(frames, 2)).toBe(1);
    expect(getLastRenderableFrameIndex(frames)).toBe(2);
  });

  it("batches child swap frames even when other frames sit between them", () => {
    const frames = [
      createMockFrame("f1", "setVal", "root"),
      createMockFrame("f2", "setLeftChild", "root"),
      createMockFrame("f3", "setColor", "root"),
      createMockFrame("f4", "blink", "root"),
      createMockFrame("f5", "setRightChild", "root"),
      createMockFrame("f6", "setVal", "left"),
    ];

    expect(getNextPlaybackFrameIndex(frames, 0)).toBe(4);
    expect(getPreviousPlaybackFrameIndex(frames, 4)).toBe(0);
    const groups = getPlaybackStepGroups(frames);
    expect(groups).toMatchObject([
      { kind: "single", startIndex: 0, endIndex: 0 },
      { kind: "swap", startIndex: 1, endIndex: 4 },
      { kind: "single", startIndex: 5, endIndex: 5 },
    ]);
    expect(groups[1]).toMatchObject({
      kind: "swap",
      primaryFrame: { id: "f2", nodeId: "root", name: "setLeftChild" },
      partnerFrame: { id: "f5", nodeId: "root", name: "setRightChild" },
    });
    expect(getPlaybackStepIndex(groups, 3)).toBe(1);
  });

  it("does not batch root swap across intervening subtree child-pointer work", () => {
    const frames = [
      createMockFrame("f1", "setVal", "root"),
      createMockFrame("f2", "setLeftChild", "root"),
      createMockFrame("f3", "setLeftChild", "child"),
      createMockFrame("f4", "setColor", "child"),
      createMockFrame("f5", "setRightChild", "root"),
      createMockFrame("f6", "setVal", "tail"),
    ];

    expect(getNextPlaybackFrameIndex(frames, 0)).toBe(1);
    expect(getNextPlaybackFrameIndex(frames, 1)).toBe(2);
    expect(getPreviousPlaybackFrameIndex(frames, 4)).toBe(3);
    expect(getPlaybackStepGroups(frames)).toMatchObject([
      { kind: "single", startIndex: 0, endIndex: 0 },
      { kind: "single", startIndex: 1, endIndex: 1 },
      { kind: "single", startIndex: 2, endIndex: 2 },
      { kind: "single", startIndex: 3, endIndex: 3 },
      { kind: "single", startIndex: 4, endIndex: 4 },
      { kind: "single", startIndex: 5, endIndex: 5 },
    ]);
  });

  it("does not batch across another node's child-pointer between sibling setters", () => {
    const frames = [
      createMockFrame("f1", "setVal", "root"),
      createMockFrame("f2", "setLeftChild", "root"),
      createMockFrame("f3", "setLeftChild", "other"),
      createMockFrame("f4", "setRightChild", "root"),
      createMockFrame("f5", "setVal", "tail"),
    ];

    expect(getPlaybackStepGroups(frames)).toMatchObject([
      { kind: "single", startIndex: 0, endIndex: 0 },
      { kind: "single", startIndex: 1, endIndex: 1 },
      { kind: "single", startIndex: 2, endIndex: 2 },
      { kind: "single", startIndex: 3, endIndex: 3 },
      { kind: "single", startIndex: 4, endIndex: 4 },
    ]);
  });
});
