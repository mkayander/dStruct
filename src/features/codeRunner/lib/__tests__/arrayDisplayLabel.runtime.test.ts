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

type AddArrayFrame = {
  name: "addArray";
  args: { options?: { displayLabel?: string } };
};

const isAddArrayFrame = (
  frame: { name: string },
): frame is AddArrayFrame => frame.name === "addArray";

const runInstrumentedSolution = (
  solutionBody: string,
  invokeArgs: unknown[] = [],
  paramList = "",
): { callstack: CallstackHelper; result: unknown } => {
  const callstack = new CallstackHelper();
  setGlobalRuntimeContext(callstack);

  const code = `return function solve(${paramList}) {\n${solutionBody}\n};`;
  const { code: instrumented } = instrumentUserJsForLineTracking(code);
  const run = new Function(`${globalDefinitionsPrefix}\n${instrumented}`) as () => (
    ...args: unknown[]
  ) => unknown;

  callstack.clear();
  const result = run()(...invokeArgs);
  return { callstack, result };
};

const addArrayFramesWithLabel = (
  callstack: CallstackHelper,
  displayLabel: string,
) =>
  callstack.frames.filter(
    (frame): frame is AddArrayFrame =>
      isAddArrayFrame(frame) &&
      frame.args.options?.displayLabel === displayLabel,
  );

describe("array displayLabel runtime", () => {
  it("records displayLabel when __dstructArrayLiteralWithName runs", () => {
    const { callstack } = runInstrumentedSolution(`
      const nums = [1, 2, 3];
      return nums;
    `);

    expect(addArrayFramesWithLabel(callstack, "nums")).toHaveLength(1);
  });

  it("inherits displayLabel on array.map result", () => {
    const { callstack } = runInstrumentedSolution(`
      const array = [1, 2];
      return array.map((value) => value * 10);
    `);

    expect(addArrayFramesWithLabel(callstack, "array").length).toBeGreaterThan(
      1,
    );
  });

  it("does not emit addArray for plain [] when transform is bypassed", () => {
    const callstack = new CallstackHelper();
    setGlobalRuntimeContext(callstack);

    const run = new Function(
      `${globalDefinitionsPrefix}
return function solve() {
  const array = [];
  array.push(1);
  return array;
};`,
    ) as () => () => unknown;

    callstack.clear();
    run()();

    expect(callstack.frames.some(isAddArrayFrame)).toBe(false);
  });

  it("tracks getLevels-style nested arrays when instrumented", () => {
    const treeStore = buildBinaryTreeFixture();
    const caseArgs: ArgumentObject[] = [
      {
        name: "head",
        type: ArgumentType.BINARY_TREE,
        order: 0,
        input: "",
      },
    ];
    const setupCallstack = new CallstackHelper();
    const head = createCaseRuntimeArgs(
      setupCallstack,
      treeStore,
      {},
      caseArgs,
    )[0] as BinaryTreeNode;

    const { callstack, result } = runInstrumentedSolution(
      `
      const array = [];
      const dfs = (node, depth = 0) => {
        array[depth] ??= [];
        array[depth].push(node.val);
        node.setColor("green");
        if (node.left) dfs(node.left, depth + 1);
        if (node.right) dfs(node.right, depth + 1);
      };
      dfs(head);
      return array.map((values) =>
        values.reduce((sum, value) => sum + value, 0) / values.length,
      );
    `,
      [head],
      "head",
    );

    expect(Array.isArray(result)).toBe(true);
    expect((result as unknown[]).length).toBeGreaterThan(0);
    expect(addArrayFramesWithLabel(callstack, "array").length).toBeGreaterThan(
      0,
    );
    expect(callstack.frames.some((frame) => frame.name === "addArrayItem")).toBe(
      true,
    );
  });
});

function buildBinaryTreeFixture(): { head: TreeData } {
  const rootId = "root";
  const leftId = "left";
  const rightId = "right";

  return {
    head: {
      type: ArgumentType.BINARY_TREE,
      order: 0,
      maxDepth: 1,
      rootId,
      edges: { ids: [], entities: {} },
      initialEdges: null,
      hiddenNodes: { ids: [], entities: {} },
      initialNodes: null,
      isRuntime: false,
      nodes: {
        ids: [rootId, leftId, rightId],
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
            childrenIds: ["", ""],
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
        },
      },
    },
  };
}
