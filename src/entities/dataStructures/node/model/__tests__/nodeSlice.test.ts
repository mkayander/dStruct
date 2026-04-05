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
