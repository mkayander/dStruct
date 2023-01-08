import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MutableRefObject } from 'react';

import type { RootState } from '#/store/makeStore';

/**
 * Payload
 */
export type TreeNodePayload = {
  id: string;
  ref?: MutableRefObject<any>;
  value: string | number;
  left?: string;
  right?: string;
};

type TreeNode = {
  ref?: MutableRefObject<any>;
  value: string | number;
  left?: string;
  right?: string;
};

/**
 * State
 */
export type TreeState = {
  count: number;
  nodes: Record<string, TreeNode>;
};

const initialState: TreeState = {
  count: 0,
  nodes: {},
};

/**
 * Slice
 * @see https://redux-toolkit.js.org/api/createslice
 */
export const treeNodeSlice = createSlice({
  name: 'TREE_NODE',
  initialState,
  reducers: {
    add: (
      state: TreeState,
      action: PayloadAction<TreeNodePayload>
    ): TreeState => {
      const {
        payload: { id, ...node },
      } = action;
      return {
        ...state,
        count: state.count + 1,
        nodes: {
          ...state.nodes,
          [id]: node,
        },
      };
    },
    remove: (
      state: TreeState,
      action: PayloadAction<Pick<TreeNodePayload, 'id'>>
    ): TreeState => {
      const { payload } = action;
      const { [payload.id]: _, ...nodes } = state.nodes;
      return {
        ...state,
        count: state.count - 1,
        nodes,
      };
    },
    attachRef: (
      state: TreeState,
      action: PayloadAction<Required<Pick<TreeNodePayload, 'id' | 'ref'>>>
    ): TreeState => {
      const { payload } = action;
      const node = state.nodes[payload.id];

      if (!node) {
        console.error(`Node with id ${payload.id} does not exist`);
        return state;
      }

      return {
        ...state,
        nodes: {
          ...state.nodes,
          [payload.id]: {
            ...node,
            ref: payload.ref,
          },
        },
      };
    },
  },
});

/**
 * Reducer
 */
export const treeNodeReducer = treeNodeSlice.reducer;

/**
 * Action
 */
export const { add, remove, attachRef } = treeNodeSlice.actions;

/**
 * Selector
 */
export const treeNodeSelector = (state: RootState) => state.treeNode;
