import { describe, expect, it } from "vitest";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { getRuntimeBinaryTreeClass } from "#/entities/dataStructures/binaryTree/model/binaryTreeNode";
import {
  type CallFrame,
  CallstackHelper,
} from "#/features/callstack/model/callstackSlice";

const isTreeNodeFrame = (
  frame: CallFrame,
): frame is CallFrame & { treeName: string } => "treeName" in frame;

describe("getRuntimeBinaryTreeClass", () => {
  it("assigns the parent visualization tree name to children linked via left/right", () => {
    const callstack = new CallstackHelper();
    const BinaryTree = getRuntimeBinaryTreeClass(callstack);

    const root = new BinaryTree(1);
    const leftChild = new BinaryTree(2);
    const rightChild = new BinaryTree(3);

    root.left = leftChild;
    root.right = rightChild;

    const rootAddFrame = callstack.frames.find(
      (frame) =>
        frame.name === "addNode" && "args" in frame && frame.args.value === 1,
    );
    const rootTreeName =
      rootAddFrame && isTreeNodeFrame(rootAddFrame)
        ? rootAddFrame.treeName
        : undefined;
    expect(rootTreeName).toBeDefined();

    callstack.clear();
    leftChild.setColor("red");

    const colorFrame = callstack.frames.find(
      (frame) => frame.name === "setColor" && "nodeId" in frame,
    );
    expect(
      colorFrame && isTreeNodeFrame(colorFrame) ? colorFrame.treeName : null,
    ).toBe(rootTreeName);
  });

  it("wires optional constructor children through setters so they share the root tree name", () => {
    const callstack = new CallstackHelper();
    const BinaryTree = getRuntimeBinaryTreeClass(callstack);

    const leftLeaf = new BinaryTree(2);
    const rightLeaf = new BinaryTree(3);
    new BinaryTree(1, leftLeaf, rightLeaf);

    const rootAddFrame = callstack.frames.find(
      (frame) =>
        frame.name === "addNode" && "args" in frame && frame.args.value === 1,
    );
    const rootTreeName =
      rootAddFrame && isTreeNodeFrame(rootAddFrame)
        ? rootAddFrame.treeName
        : undefined;
    expect(rootTreeName).toBeDefined();

    callstack.clear();
    leftLeaf.setColor("cyan");

    const colorFrame = callstack.frames.find(
      (frame) => frame.name === "setColor" && "nodeId" in frame,
    );
    expect(
      colorFrame && isTreeNodeFrame(colorFrame) ? colorFrame.treeName : null,
    ).toBe(rootTreeName);
    expect(
      colorFrame && isTreeNodeFrame(colorFrame) ? colorFrame.argType : null,
    ).toBe(ArgumentType.BINARY_TREE);
  });
});
