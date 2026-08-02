import { describe, expect, it } from "vitest";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentObject } from "#/entities/argument/model/types";
import { type BinaryTreeNode } from "#/entities/dataStructures/binaryTree/model/binaryTreeNode";
import type { TreeData } from "#/entities/dataStructures/node/model/nodeSlice";
import {
  type CallFrame,
  CallstackHelper,
} from "#/features/callstack/model/callstackSlice";
import { createCaseRuntimeArgs } from "#/features/codeRunner/lib/createCaseRuntimeArgs";
import { instrumentUserJsForLineTracking } from "#/features/codeRunner/lib/instrumentUserJsForLineTracking";
import {
  globalDefinitionsPrefix,
  setGlobalRuntimeContext,
} from "#/features/codeRunner/lib/setGlobalRuntimeContext";

const getDisplayLabelFromFrame = (frame: CallFrame): string | undefined => {
  if (frame.name !== "addArray" || !("args" in frame)) return undefined;
  return frame.args.options?.displayLabel;
};

const addArrayFramesWithLabel = (
  callstack: CallstackHelper,
  displayLabel: string,
) =>
  callstack.frames.filter(
    (frame) => getDisplayLabelFromFrame(frame) === displayLabel,
  );

const runInstrumentedSolution = (
  solutionBody: string,
  invokeArgs: unknown[] = [],
  paramList = "",
): { callstack: CallstackHelper; result: unknown } => {
  const callstack = new CallstackHelper();
  setGlobalRuntimeContext(callstack);

  const code = `return function solve(${paramList}) {\n${solutionBody}\n};`;
  const { code: instrumented } = instrumentUserJsForLineTracking(code);
  const run = new Function(
    `${globalDefinitionsPrefix}\n${instrumented}`,
  ) as () => (...args: unknown[]) => unknown;

  callstack.clear();
  const result = run()(...invokeArgs);
  return { callstack, result };
};

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

    expect(callstack.frames.some((frame) => frame.name === "addArray")).toBe(
      false,
    );
  });

  it("does not create a phantom matrix from destructuring string-arg swap", () => {
    const { callstack, result } = runInstrumentedSolution(`
      let num1 = new String("11");
      let num2 = new String("123");
      if (num1.length < num2.length) {
        [num1, num2] = [num2, num1];
      }
      const nums = new Array();
      nums.push(1, 3, 4);
      return nums.reverse().join("");
    `);

    expect(result).toBe("431");
    const addArrayFrames = callstack.frames.filter(
      (frame) => frame.name === "addArray",
    );
    expect(addArrayFrames).toHaveLength(3);
    expect(
      addArrayFrames.filter(
        (frame) => getDisplayLabelFromFrame(frame) === "nums",
      ),
    ).toHaveLength(1);
    expect(
      callstack.frames.some(
        (frame) =>
          frame.name === "addArrayItem" &&
          "args" in frame &&
          frame.args.childName,
      ),
    ).toBe(false);
  });

  it("supports addStrings-style empty new Array() with push", () => {
    const { callstack, result } = runInstrumentedSolution(`
      const nums = new Array();
      nums.push(1, 2, 3);
      return nums.reverse().join("");
    `);

    expect(result).toBe("321");
    expect(addArrayFramesWithLabel(callstack, "nums")).toHaveLength(1);
  });

  it("accepts legacy new Array({ displayLabel }) single-arg form", () => {
    const callstack = new CallstackHelper();
    setGlobalRuntimeContext(callstack);

    const run = new Function(
      `${globalDefinitionsPrefix}
return function solve() {
  const nums = new Array({ displayLabel: "nums" });
  nums.push(5);
  return nums[0];
};`,
    ) as () => () => unknown;

    callstack.clear();
    expect(run()()).toBe(5);
  });

  it("supports dynamic-length new Array(n) with displayLabel append", () => {
    const callstack = new CallstackHelper();
    setGlobalRuntimeContext(callstack);

    const run = new Function(
      `${globalDefinitionsPrefix}
return function solve(n) {
  const buf = new Array(n, { displayLabel: "buf" });
  buf[0] = 7;
  return buf.length;
};`,
    ) as () => (length: number) => number;

    callstack.clear();
    expect(run()(3)).toBe(3);
    expect(addArrayFramesWithLabel(callstack, "buf")).toHaveLength(1);
  });

  it("rejects non-primitive elements in ArrayProxy constructor", () => {
    const callstack = new CallstackHelper();
    setGlobalRuntimeContext(callstack);
    const ArrayProxy = (
      globalThis as unknown as {
        ArrayProxy: new (...items: unknown[]) => unknown;
      }
    ).ArrayProxy;

    expect(() => {
      new ArrayProxy({ not: "allowed" });
    }).toThrow("ArrayProxy can only contain numbers or strings");
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
    expect(
      callstack.frames.some((frame) => frame.name === "addArrayItem"),
    ).toBe(true);
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
