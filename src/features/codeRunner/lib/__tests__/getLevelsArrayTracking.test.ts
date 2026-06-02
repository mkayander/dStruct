import { describe, expect, it } from "vitest";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentObject } from "#/entities/argument/model/types";
import { BinaryTreeNode } from "#/entities/dataStructures/binaryTree/model/binaryTreeNode";
import type { TreeData } from "#/entities/dataStructures/node/model/nodeSlice";
import { CallstackHelper } from "#/features/callstack/model/callstackSlice";
import { createCaseRuntimeArgs } from "#/features/codeRunner/lib/createCaseRuntimeArgs";
import { instrumentUserJsForLineTracking } from "#/features/codeRunner/lib/instrumentUserJsForLineTracking";
import {
  globalDefinitionsPrefix,
  setGlobalRuntimeContext,
} from "#/features/codeRunner/lib/setGlobalRuntimeContext";

function buildBinaryTreeStore(): { head: TreeData } {
  const rootId = "root";
  const leftId = "left";
  const rightId = "right";
  const leftLeftId = "left-left";

  return {
    head: {
      type: ArgumentType.BINARY_TREE,
      order: 0,
      maxDepth: 2,
      rootId,
      edges: { ids: [], entities: {} },
      initialEdges: null,
      hiddenNodes: { ids: [], entities: {} },
      initialNodes: null,
      isRuntime: false,
      nodes: {
        ids: [rootId, leftId, rightId, leftLeftId],
        entities: {
          [rootId]: {
            id: rootId,
            value: 1,
            depth: 0,
            argType: ArgumentType.BINARY_TREE,
            childrenIds: [leftId, rightId],
            x: 0,
            y: 0,
          },
          [leftId]: {
            id: leftId,
            value: 3,
            depth: 1,
            argType: ArgumentType.BINARY_TREE,
            childrenIds: [leftLeftId, ""],
            x: 0,
            y: 0,
          },
          [rightId]: {
            id: rightId,
            value: 2,
            depth: 1,
            argType: ArgumentType.BINARY_TREE,
            childrenIds: ["", ""],
            x: 0,
            y: 0,
          },
          [leftLeftId]: {
            id: leftLeftId,
            value: 4,
            depth: 2,
            argType: ArgumentType.BINARY_TREE,
            childrenIds: ["", ""],
            x: 0,
            y: 0,
          },
        },
      },
    },
  };
}

const getLevelsCode = `/**
 * @param {TreeNodeObject} head
 */
return function getLevels(head) {
  const array = [];

  const dfs = (node, depth = 0) => {
      array[depth] ??= [];
      array[depth].push(node.val);

      node.setColor("green");

      node.left && dfs(node.left, depth + 1);
      node.right && dfs(node.right, depth + 1);
  };

  dfs(head);

  return array.map((values) => values.reduce((acc, curr) => acc + curr, 0) / values.length);
};`;

describe("getLevels array tracking", () => {
  it("emits addArray frames and displayLabel when instrumented", () => {
    const callstack = new CallstackHelper();
    setGlobalRuntimeContext(callstack);

    const treeStore = buildBinaryTreeStore();
    const caseArgs: ArgumentObject[] = [
      {
        name: "head",
        type: ArgumentType.BINARY_TREE,
        order: 0,
        input: "",
      },
    ];

    const args = createCaseRuntimeArgs(callstack, treeStore, {}, caseArgs);
    expect(args[0]).toBeInstanceOf(BinaryTreeNode);

    const { code: instrumented, ok } =
      instrumentUserJsForLineTracking(getLevelsCode);
    expect(ok).toBe(true);

    const prefixedCode = `${globalDefinitionsPrefix}\n${instrumented}`;
    const run = new Function(prefixedCode) as () => (
      head: BinaryTreeNode,
    ) => number[];
    callstack.clear();
    const result = run()(args[0] as BinaryTreeNode);

    expect(result).toHaveLength(3);
    const addArrayFrames = callstack.frames.filter(
      (frame) => frame.name === "addArray",
    );
    expect(addArrayFrames.length).toBeGreaterThan(0);
    const labeledFrame = addArrayFrames.find(
      (frame) =>
        frame.name === "addArray" &&
        frame.args.options?.displayLabel === "array",
    );
    expect(labeledFrame).toBeDefined();
  });

  it("does not emit addArray for plain [] without instrumentation", () => {
    const callstack = new CallstackHelper();
    setGlobalRuntimeContext(callstack);

    const treeStore = buildBinaryTreeStore();
    const caseArgs: ArgumentObject[] = [
      {
        name: "head",
        type: ArgumentType.BINARY_TREE,
        order: 0,
        input: "",
      },
    ];
    const args = createCaseRuntimeArgs(callstack, treeStore, {}, caseArgs);

    const plainCode = `return function getLevels(head) {
  const array = [];
  const dfs = (node, depth = 0) => {
    array[depth] ??= [];
    array[depth].push(node.val);
    node.setColor("green");
    if (node.left) dfs(node.left, depth + 1);
    if (node.right) dfs(node.right, depth + 1);
  };
  dfs(head);
  return array.map((values) => values.reduce((acc, curr) => acc + curr, 0) / values.length);
};`;

    const prefixedCode = `${globalDefinitionsPrefix}\n${plainCode}`;
    const run = new Function(prefixedCode) as () => (
      head: BinaryTreeNode,
    ) => number[];
    callstack.clear();
    run()(args[0] as BinaryTreeNode);

    const addArrayFrames = callstack.frames.filter(
      (frame) => frame.name === "addArray",
    );
    expect(addArrayFrames).toHaveLength(0);
  });
});
