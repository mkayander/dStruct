import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { RootState } from '#/store/makeStore';

/**
 * Payload
 */
export type BinaryTreeNodeDataPayload = {
  id: string;
  value: string | number;
  color?: string;
};

export type BinaryTreeNodeData = {
  id: string;
  value: string | number;
  color?: string;
};

const treeNodeDataAdapter = createEntityAdapter<BinaryTreeNodeData>({
  selectId: (node: BinaryTreeNodeData) => node.id,
});

const initialState = {
  count: 0,
  nodes: treeNodeDataAdapter.getInitialState(),
};

type TreeDataState = typeof initialState;

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

      // return {
      //   ...state,
      //   count: state.count + 1,
      //   nodes: treeNodeDataAdapter.addOne(state.nodes, {
      //     id,
      //     ...node,
      //   }),
      // };
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

export const treeNodeDataSelector = treeNodeDataAdapter.getSelectors(
  (state: RootState) => state.treeNode.nodes
);

export const selectNodeDataById = (id: string) => (state: RootState) =>
  treeNodeDataSelector.selectById(state, id);
