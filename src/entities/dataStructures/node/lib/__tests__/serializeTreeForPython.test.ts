import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { createPythonRuntimeArgs } from "#/features/codeRunner/lib/createPythonRuntimeArgs";

import type { TreeData, TreeDataState } from "../../model/nodeSlice";
import {
  serializeBinaryTreeLevelOrderWithIds,
  serializeLinkedListWithIds,
} from "../serializeTreeForPython";

function binaryTreeFixture(): TreeData {
  const rootId = "node-root";
  const leftId = "node-left";
  const rightId = "node-right";

  return {
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
          value: 2,
          depth: 1,
          argType: ArgumentType.BINARY_TREE,
          childrenIds: [],
          x: 0,
          y: 0,
        },
        [rightId]: {
          id: rightId,
          value: 3,
          depth: 1,
          argType: ArgumentType.BINARY_TREE,
          childrenIds: [],
          x: 0,
          y: 0,
        },
      },
    },
  };
}

function linkedListFixture(): TreeData {
  const firstId = "n1";
  const secondId = "n2";

  return {
    type: ArgumentType.LINKED_LIST,
    order: 0,
    maxDepth: 1,
    rootId: firstId,
    edges: { ids: [], entities: {} },
    initialEdges: null,
    hiddenNodes: { ids: [], entities: {} },
    initialNodes: null,
    isRuntime: false,
    nodes: {
      ids: [firstId, secondId],
      entities: {
        [firstId]: {
          id: firstId,
          value: 10,
          depth: 0,
          argType: ArgumentType.LINKED_LIST,
          childrenIds: [secondId],
          x: 0,
          y: 0,
        },
        [secondId]: {
          id: secondId,
          value: 20,
          depth: 0,
          argType: ArgumentType.LINKED_LIST,
          childrenIds: [],
          x: 0,
          y: 0,
        },
      },
    },
  };
}

describe("serializeBinaryTreeLevelOrderWithIds", () => {
  it("matches LeetCode level-order layout with parallel ids", () => {
    const tree = binaryTreeFixture();
    const payload = serializeBinaryTreeLevelOrderWithIds(tree, "root");
    expect(payload).not.toBeNull();
    if (!payload) return;
    expect(payload.treeName).toBe("root");
    expect(payload.levelOrder).toEqual([1, 2, 3]);
    expect(payload.nodeIds).toEqual(["node-root", "node-left", "node-right"]);
  });

  it("returns null when treeData is missing", () => {
    expect(serializeBinaryTreeLevelOrderWithIds(undefined, "n")).toBeNull();
  });

  it("serializes a single-node tree as [root] only", () => {
    const rootId = "solo";
    const tree: TreeData = {
      type: ArgumentType.BINARY_TREE,
      order: 0,
      maxDepth: 0,
      rootId,
      edges: { ids: [], entities: {} },
      initialEdges: null,
      hiddenNodes: { ids: [], entities: {} },
      initialNodes: null,
      isRuntime: false,
      nodes: {
        ids: [rootId],
        entities: {
          [rootId]: {
            id: rootId,
            value: 9,
            depth: 0,
            argType: ArgumentType.BINARY_TREE,
            childrenIds: [],
            x: 0,
            y: 0,
          },
        },
      },
    };
    const payload = serializeBinaryTreeLevelOrderWithIds(tree, "t");
    expect(payload).not.toBeNull();
    if (!payload) return;
    expect(payload.levelOrder).toEqual([9]);
    expect(payload.nodeIds).toEqual([rootId]);
  });

  it("reads entities from initialNodes when the snapshot is present", () => {
    const base = binaryTreeFixture();
    const tree: TreeData = {
      ...base,
      nodes: { ids: [], entities: {} },
      initialNodes: {
        ids: [...base.nodes.ids],
        entities: { ...base.nodes.entities },
      },
    };
    const payload = serializeBinaryTreeLevelOrderWithIds(tree, "t");
    expect(payload).not.toBeNull();
    if (!payload) return;
    expect(payload.levelOrder).toEqual([1, 2, 3]);
  });
});

describe("serializeLinkedListWithIds", () => {
  it("walks next pointers and collects ids", () => {
    const tree = linkedListFixture();
    const payload = serializeLinkedListWithIds(tree, "head");
    expect(payload).not.toBeNull();
    if (!payload) return;
    expect(payload.treeName).toBe("head");
    expect(payload.values).toEqual([10, 20]);
    expect(payload.nodeIds).toEqual(["n1", "n2"]);
  });

  it("returns null when treeData is missing", () => {
    expect(serializeLinkedListWithIds(undefined, "h")).toBeNull();
  });
});

describe("createPythonRuntimeArgs tree parity payload", () => {
  it("uses tracked tree shapes when treeNode slice is provided", () => {
    const treeName = "t";
    const treeState: TreeDataState = {
      [treeName]: binaryTreeFixture(),
    };

    const args = createPythonRuntimeArgs(
      [
        {
          name: treeName,
          type: ArgumentType.BINARY_TREE,
          order: 0,
          input: "[1,2,3]",
        },
      ],
      { treeNode: treeState },
    );

    const first = args[0];
    expect(first).toBeDefined();
    if (!first || typeof first.value !== "object" || first.value === null) {
      throw new Error("expected object payload");
    }
    const value = first.value as { levelOrder: unknown[]; treeName: string };
    expect(value.treeName).toBe(treeName);
    expect(value.levelOrder).toEqual([1, 2, 3]);
  });

  it("falls back to parsed level-order array when slice has no entry for arg name", () => {
    const treeState: TreeDataState = {
      other: binaryTreeFixture(),
    };
    const args = createPythonRuntimeArgs(
      [
        {
          name: "missing",
          type: ArgumentType.BINARY_TREE,
          order: 0,
          input: "[1,2,3]",
        },
      ],
      { treeNode: treeState },
    );
    expect(args[0]?.value).toEqual([1, 2, 3]);
  });

  it("embeds linked-list tracked payload when treeNode matches", () => {
    const name = "head";
    const treeState: TreeDataState = {
      [name]: linkedListFixture(),
    };
    const args = createPythonRuntimeArgs(
      [
        {
          name,
          type: ArgumentType.LINKED_LIST,
          order: 0,
          input: "[10,20]",
        },
      ],
      { treeNode: treeState },
    );
    const value = args[0]?.value;
    expect(value).toEqual(
      expect.objectContaining({
        treeName: name,
        values: [10, 20],
        nodeIds: ["n1", "n2"],
      }),
    );
  });
});
