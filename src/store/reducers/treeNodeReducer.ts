import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type EntityState,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { RootState } from '#/store/makeStore';

/**
 * Payload
 */
export type BinaryTreeNodeDataPayload = {
  id: string;
  value: string | number;
  depth: number;
  color?: string;
  left?: string;
  right?: string;
};

export type BinaryTreeNodeData = {
  id: string;
  value: string | number;
  depth: number;
  color?: string;
  left?: string;
  right?: string;
};

type TreeDataState = {
  count: number;
  maxDepth: number;
  rootId: string | null;
  nodes: EntityState<BinaryTreeNodeData>;
};

const treeNodeDataAdapter = createEntityAdapter<BinaryTreeNodeData>({
  selectId: (node: BinaryTreeNodeData) => node.id,
});

const initialState: TreeDataState = {
  count: 0,
  maxDepth: 0,
  rootId: null,
  nodes: treeNodeDataAdapter.getInitialState(),
};

/**
 * Slice
 * @see https://redux-toolkit.js.org/api/createslice
 */
export const treeNodeSlice = createSlice({
  name: 'BINARY_TREE_NODE',
  initialState,
  reducers: {
    add: (
      state: TreeDataState,
      action: PayloadAction<BinaryTreeNodeDataPayload>
    ) => {
      const {
        payload: { id, ...node },
      } = action;

      state.count++;
      treeNodeDataAdapter.addOne(state.nodes, { id, ...node });
    },
    addMany: (
      state: TreeDataState,
      action: PayloadAction<{
        maxDepth: number;
        nodes: BinaryTreeNodeDataPayload[];
      }>
    ) => {
      const {
        payload: { maxDepth, nodes },
      } = action;

      state.rootId = nodes[0]?.id || null;
      state.count += nodes.length;
      state.maxDepth = maxDepth;
      treeNodeDataAdapter.addMany(state.nodes, nodes);
    },
    update: (
      state: TreeDataState,
      action: PayloadAction<BinaryTreeNodeDataPayload>
    ) => {
      const {
        payload: { id, ...node },
      } = action;

      treeNodeDataAdapter.updateOne(state.nodes, {
        id,
        changes: node,
      });
    },
    setRoot: (state: TreeDataState, action: PayloadAction<string>) => {
      state.rootId = action.payload;
    },
    remove: (
      state: TreeDataState,
      action: PayloadAction<Pick<BinaryTreeNodeDataPayload, 'id'>>
    ) => {
      state.count--;
      treeNodeDataAdapter.removeOne(state.nodes, action.payload.id);
    },
    clearAll: (): TreeDataState => {
      return {
        ...initialState,
      };
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

export const selectAllNodeData = createSelector(treeDataSelector, (state) =>
  treeNodeDataSelector.selectAll(state.nodes)
);

export const selectNodeDataById = (id: string) =>
  createSelector(treeDataSelector, (treeData) =>
    treeNodeDataSelector.selectById(treeData.nodes, id)
  );

export const selectRootNodeData = createSelector(treeDataSelector, (treeNode) =>
  treeNodeDataSelector.selectById(treeNode.nodes, treeNode.rootId || '')
);
