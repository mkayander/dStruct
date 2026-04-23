import { describe, expect, it } from "vitest";

import { ArgumentType } from "#/entities/argument/model/argumentObject";

import {
  getEdgeId,
  type TreeDataState,
  type TreeNodeData,
  treeNodeSlice,
} from "../nodeSlice";

const TREE_NAME = "head";

const createNode = (
  id: string,
  value: number,
  childrenIds: (string | undefined)[] = [],
): TreeNodeData => ({
  id,
  value,
  argType: ArgumentType.BINARY_TREE,
  depth: 0,
  x: 0,
  y: 0,
  childrenIds,
});

const reduce = (
  state: TreeDataState | undefined,
  action: ReturnType<
    (typeof treeNodeSlice.actions)[keyof typeof treeNodeSlice.actions]
  >,
) => treeNodeSlice.reducer(state, action);

const createInitializedTreeState = () => {
  let state = reduce(
    undefined,
    treeNodeSlice.actions.init({
      name: TREE_NAME,
      type: ArgumentType.BINARY_TREE,
      order: 0,
    }),
  );

  state = reduce(
    state,
    treeNodeSlice.actions.addMany({
      name: TREE_NAME,
      data: {
        maxDepth: 1,
        nodes: [
          createNode("1", 1, ["2", "3"]),
          createNode("2", 2),
          createNode("3", 3),
        ],
      },
    }),
  );

  return reduce(
    state,
    treeNodeSlice.actions.addManyEdges({
      name: TREE_NAME,
      data: [
        {
          id: getEdgeId("1", "2"),
          sourceId: "1",
          targetId: "2",
          isDirected: false,
        },
        {
          id: getEdgeId("1", "3"),
          sourceId: "1",
          targetId: "3",
          isDirected: false,
        },
      ],
    }),
  );
};

describe("treeNodeSlice", () => {
  it("moves an entire subtree when setChildId re-parents from another tree", () => {
    const parentTree = "parentTree";
    const childTree = "childTree";

    let state = reduce(
      undefined,
      treeNodeSlice.actions.init({
        name: parentTree,
        type: ArgumentType.BINARY_TREE,
        order: 0,
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.init({
        name: childTree,
        type: ArgumentType.BINARY_TREE,
        order: 1,
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.addMany({
        name: parentTree,
        data: {
          maxDepth: 0,
          nodes: [createNode("root", 3)],
        },
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.addMany({
        name: childTree,
        data: {
          maxDepth: 0,
          nodes: [
            createNode("subroot", 20, ["left", "right"]),
            createNode("left", 15),
            createNode("right", 7),
          ],
        },
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.addManyEdges({
        name: childTree,
        data: [
          {
            id: getEdgeId("subroot", "left"),
            sourceId: "subroot",
            targetId: "left",
            isDirected: false,
          },
          {
            id: getEdgeId("subroot", "right"),
            sourceId: "subroot",
            targetId: "right",
            isDirected: false,
          },
        ],
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.setChildId({
        name: parentTree,
        data: {
          id: "root",
          index: 1,
          childId: "subroot",
          childTreeName: childTree,
        },
      }),
    );

    const parent = state[parentTree];
    expect(parent?.nodes.ids).toHaveLength(4);
    expect(parent?.nodes.entities["subroot"]?.childrenIds).toEqual([
      "left",
      "right",
    ]);
    expect(parent?.nodes.entities["left"]?.value).toBe(15);
    expect(parent?.nodes.entities["right"]?.value).toBe(7);
    expect(parent?.edges.ids).toEqual(
      expect.arrayContaining([
        getEdgeId("root", "subroot"),
        getEdgeId("subroot", "left"),
        getEdgeId("subroot", "right"),
      ]),
    );
    expect(state[childTree]).toBeUndefined();
  });

  it("sets rootId on the first runtime binary tree node add", () => {
    let state = reduce(
      undefined,
      treeNodeSlice.actions.init({
        name: TREE_NAME,
        type: ArgumentType.BINARY_TREE,
        order: 0,
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.add({
        name: TREE_NAME,
        data: createNode("root", 3),
      }),
    );

    expect(state[TREE_NAME]?.rootId).toBe("root");

    state = reduce(
      state,
      treeNodeSlice.actions.add({
        name: TREE_NAME,
        data: createNode("child", 9),
      }),
    );

    expect(state[TREE_NAME]?.rootId).toBe("root");
  });

  it("clears rootId when the root binary tree node is removed", () => {
    let state = reduce(
      undefined,
      treeNodeSlice.actions.init({
        name: TREE_NAME,
        type: ArgumentType.BINARY_TREE,
        order: 0,
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.add({
        name: TREE_NAME,
        data: createNode("root", 3),
      }),
    );
    expect(state[TREE_NAME]?.rootId).toBe("root");

    state = reduce(
      state,
      treeNodeSlice.actions.add({
        name: TREE_NAME,
        data: createNode("other", 99),
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.remove({
        name: TREE_NAME,
        data: { id: "root" },
      }),
    );

    expect(state[TREE_NAME]?.rootId).toBeNull();
    expect(state[TREE_NAME]?.nodes.entities["other"]).toBeDefined();
  });

  it("leaves unrelated nodes in the source tree when moving a subtree cross-tree", () => {
    const parentTree = "parentTree";
    const childTree = "childTree";

    let state = reduce(
      undefined,
      treeNodeSlice.actions.init({
        name: parentTree,
        type: ArgumentType.BINARY_TREE,
        order: 0,
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.init({
        name: childTree,
        type: ArgumentType.BINARY_TREE,
        order: 1,
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.addMany({
        name: parentTree,
        data: {
          maxDepth: 0,
          nodes: [createNode("root", 3)],
        },
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.addMany({
        name: childTree,
        data: {
          maxDepth: 0,
          nodes: [
            createNode("subroot", 20, ["leaf"]),
            createNode("leaf", 15),
            createNode("straggler", 99),
          ],
        },
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.addManyEdges({
        name: childTree,
        data: [
          {
            id: getEdgeId("subroot", "leaf"),
            sourceId: "subroot",
            targetId: "leaf",
            isDirected: false,
          },
        ],
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.setChildId({
        name: parentTree,
        data: {
          id: "root",
          index: 0,
          childId: "subroot",
          childTreeName: childTree,
        },
      }),
    );

    const parent = state[parentTree];
    const remaining = state[childTree];
    expect(parent?.nodes.ids).toHaveLength(3);
    expect(parent?.nodes.entities["straggler"]).toBeUndefined();
    expect(remaining?.nodes.entities["straggler"]?.value).toBe(99);
    expect(remaining?.nodes.ids).toHaveLength(1);
    expect(remaining?.edges.ids).toHaveLength(0);
  });

  it("applies sibling child swaps atomically with a single childrenIds update", () => {
    const state = reduce(
      createInitializedTreeState(),
      treeNodeSlice.actions.setChildIds({
        name: TREE_NAME,
        data: {
          id: "1",
          updates: [
            { index: 0, childId: "3" },
            { index: 1, childId: "2" },
          ],
        },
      }),
    );

    const treeState = state[TREE_NAME];
    expect(treeState?.nodes.entities["1"]?.childrenIds).toEqual(["3", "2"]);
    expect(treeState?.edges.ids).toEqual(
      expect.arrayContaining([getEdgeId("1", "2"), getEdgeId("1", "3")]),
    );
    expect(treeState?.edges.ids).toHaveLength(2);
  });

  it("keeps both edges during a left/right child swap", () => {
    let state = createInitializedTreeState();

    state = reduce(
      state,
      treeNodeSlice.actions.setChildId({
        name: TREE_NAME,
        data: {
          id: "1",
          index: 0,
          childId: "3",
        },
      }),
    );

    state = reduce(
      state,
      treeNodeSlice.actions.setChildId({
        name: TREE_NAME,
        data: {
          id: "1",
          index: 1,
          childId: "2",
        },
      }),
    );

    const treeState = state[TREE_NAME];
    expect(treeState?.nodes.entities["1"]?.childrenIds).toEqual(["3", "2"]);
    expect(treeState?.edges.ids).toEqual(
      expect.arrayContaining([getEdgeId("1", "2"), getEdgeId("1", "3")]),
    );
    expect(treeState?.edges.ids).toHaveLength(2);
  });

  it("restores initial edges on resetAll after structural mutations", () => {
    let state = createInitializedTreeState();

    state = reduce(state, treeNodeSlice.actions.backupAllNodes());
    state = reduce(
      state,
      treeNodeSlice.actions.setChildId({
        name: TREE_NAME,
        data: {
          id: "1",
          index: 0,
          childId: "3",
        },
      }),
    );
    state = reduce(
      state,
      treeNodeSlice.actions.setChildId({
        name: TREE_NAME,
        data: {
          id: "1",
          index: 1,
          childId: "2",
        },
      }),
    );

    state = reduce(state, treeNodeSlice.actions.resetAll());

    const treeState = state[TREE_NAME];
    expect(treeState?.nodes.entities["1"]?.childrenIds).toEqual(["2", "3"]);
    expect(treeState?.edges.ids).toEqual(
      expect.arrayContaining([getEdgeId("1", "2"), getEdgeId("1", "3")]),
    );
    expect(treeState?.edges.ids).toHaveLength(2);
  });

  it("restores original node colors after resetAll", () => {
    let state = createInitializedTreeState();

    state = reduce(state, treeNodeSlice.actions.backupAllNodes());
    state = reduce(
      state,
      treeNodeSlice.actions.update({
        name: TREE_NAME,
        data: {
          id: "1",
          changes: {
            color: "green",
          },
        },
      }),
    );

    expect(state[TREE_NAME]?.nodes.entities["1"]?.color).toBe("green");

    state = reduce(state, treeNodeSlice.actions.resetAll());

    expect(state[TREE_NAME]?.nodes.entities["1"]?.color).toBeUndefined();
  });
});
