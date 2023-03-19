import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type EntityState,
  type PayloadAction,
  type Update,
} from "@reduxjs/toolkit";

import type { RootState } from "#/store/makeStore";

export type AnimationName = "blink";

export type BinaryTreeNodeData = {
  id: string;
  value: string | number;
  depth: number;
  color?: string;
  animation?: AnimationName;
  isHighlighted?: boolean;
  left?: string;
  right?: string;
  x: number;
  y: number;
};

type TreePayload<T> = PayloadAction<{
  name: string;
  data: T;
}>;

export type TreeData = {
  count: number;
  maxDepth: number;
  rootId: string | null;
  initialNodes: EntityState<BinaryTreeNodeData>;
  nodes: EntityState<BinaryTreeNodeData>;
};

export type TreeDataState = Record<string, TreeData>;

const treeNodeDataAdapter = createEntityAdapter<BinaryTreeNodeData>({
  selectId: (node: BinaryTreeNodeData) => node.id,
});

const getTreeState = (state: TreeDataState, name: string) => {
  const treeState = state[name];
  if (!treeState) {
    console.error(
      "getTreeState: Tree state not found: ",
      { name, state },
      getTreeState.caller
    );
    return null;
  }

  return treeState;
};

const runNamedTreeAction = (
  state: TreeDataState,
  name: string,
  action: (treeState: TreeData) => void
) => {
  const treeState = getTreeState(state, name);
  if (!treeState) return;

  action(treeState);
};

const resetTree = (treeState: TreeData) => {
  if (treeState.initialNodes.ids.length === 0) return;

  treeNodeDataAdapter.removeAll(treeState.nodes);
  treeNodeDataAdapter.addMany(
    treeState.nodes,
    treeNodeDataSelector.selectAll(treeState.initialNodes)
  );
};

const getInitialData = (): TreeData => ({
  count: 0,
  maxDepth: 0,
  rootId: null,
  initialNodes: treeNodeDataAdapter.getInitialState(),
  nodes: treeNodeDataAdapter.getInitialState(),
});
const initialState: TreeDataState = {};

/**
 * Slice
 * @see https://redux-toolkit.js.org/api/createslice
 */
export const treeNodeSlice = createSlice({
  name: "BINARY_TREE_NODE",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<{ name: string }>) => {
      state[action.payload.name] = getInitialData();
    },
    add: (state, action: TreePayload<BinaryTreeNodeData>) =>
      runNamedTreeAction(state, action.payload.name, (treeState) => {
        const {
          payload: {
            data: { id, ...node },
          },
        } = action;

        treeState.count++;
        treeNodeDataAdapter.addOne(treeState.nodes, { id, ...node });
      }),
    addMany: (
      state,
      action: TreePayload<{
        maxDepth: number;
        nodes: BinaryTreeNodeData[];
      }>
    ) => {
      const {
        payload: {
          data: { maxDepth, nodes },
        },
      } = action;

      const treeState = state[action.payload.name];
      if (!treeState) return;

      treeState.rootId = nodes[0]?.id || null;
      treeState.count += nodes.length;
      treeState.maxDepth = maxDepth;
      treeNodeDataAdapter.addMany(treeState.nodes, nodes);
    },
    update: (state, action: TreePayload<Update<BinaryTreeNodeData>>) =>
      runNamedTreeAction(state, action.payload.name, (treeState) =>
        treeNodeDataAdapter.updateOne(treeState.nodes, action.payload.data)
      ),
    setRoot: (state, action: TreePayload<string>) =>
      runNamedTreeAction(state, action.payload.name, (treeState) => {
        treeState.rootId = action.payload.data;
      }),
    remove: (state, action: TreePayload<Pick<BinaryTreeNodeData, "id">>) =>
      runNamedTreeAction(state, action.payload.name, (treeState) => {
        treeState.count--;
        treeNodeDataAdapter.removeOne(treeState.nodes, action.payload.data.id);
      }),
    clear: (state, action: TreePayload<undefined>) =>
      runNamedTreeAction(state, action.payload.name, (treeState) => {
        treeNodeDataAdapter.removeAll(treeState.nodes);
      }),
    clearAll: (): TreeDataState => {
      return {
        ...initialState,
      };
    },
    backupAllNodes: (state: TreeDataState) => {
      for (const name in state) {
        runNamedTreeAction(state, name, (treeState) => {
          if (treeState.initialNodes.ids.length > 0) return;

          treeNodeDataAdapter.addMany(
            treeState.initialNodes,
            treeNodeDataSelector.selectAll(treeState.nodes)
          );
        });
      }
    },
    reset: (state: TreeDataState, action: TreePayload<undefined>) =>
      runNamedTreeAction(state, action.payload.name, (treeState) =>
        resetTree(treeState)
      ),
    resetAll: (state: TreeDataState) => {
      for (const name in state) {
        runNamedTreeAction(state, name, (treeState) => resetTree(treeState));
      }
    },
  },
});

/**
 * Reducer
 */
export const treeNodeReducer = treeNodeSlice.reducer;

/**
 * Selector
 */
export const treeDataSelector = (state: RootState) => state.treeNode;

export const treeNodeDataSelector = treeNodeDataAdapter.getSelectors();

export const selectAllNodeData = (name: string) =>
  createSelector(treeDataSelector, (state) => {
    const treeState = state[name];
    if (!treeState) {
      console.error("selectAllNodeData: Tree state not found: ", name);
      return [];
    }

    return treeNodeDataSelector.selectAll(treeState.nodes);
  });

export const selectNodeDataById = (name: string, id: string) =>
  createSelector(treeDataSelector, (state) => {
    const treeState = getTreeState(state, name);
    if (!treeState) return null;

    return treeNodeDataSelector.selectById(treeState.nodes, id);
  });

export const selectRootNodeData = (name: string) =>
  createSelector(treeDataSelector, (state) => {
    const treeState = getTreeState(state, name);
    if (!treeState) return null;

    treeNodeDataSelector.selectById(treeState.nodes, treeState.rootId || "");
  });

export const selectNamedTreeMaxDepth = (name: string) =>
  createSelector(treeDataSelector, (state) => {
    const treeState = getTreeState(state, name);
    if (!treeState) return null;

    return treeState.maxDepth;
  });

export const selectTreeMaxDepth = createSelector(treeDataSelector, (state) =>
  Math.max(...Object.values(state).map((treeState) => treeState.maxDepth))
);
