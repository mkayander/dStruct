import {
  createEntityAdapter,
  createSlice,
  type EntityState,
} from '@reduxjs/toolkit';

import type { RootState } from '#/store/makeStore';

export type CallFrame = {
  // id: string;
  nodeId: string;
  // order: number;
  name: string;
  args: any[];
  timestamp: number;
};

const callstackAdapter = createEntityAdapter<CallFrame>({
  selectId: (frame) => frame.timestamp,
  sortComparer: (a, b) => a.timestamp - b.timestamp,
});

/**
 * Payload
 */
// export type CallstackPayload = CallFrame[];

/**
 * State
 */
export type CallstackState = EntityState<CallFrame>;

const initialState: CallstackState = callstackAdapter.getInitialState();

/**
 * Slice
 * @see https://redux-toolkit.js.org/api/createslice
 */
export const callstackSlice = createSlice({
  name: 'CALLSTACK',
  initialState,
  reducers: {
    addOne: callstackAdapter.addOne,
    addMany: callstackAdapter.addMany,
    removeOne: callstackAdapter.removeOne,
    removeAll: callstackAdapter.removeAll,
  },
});

/**
 * Reducer
 */
export const callstackReducer = callstackSlice.reducer;

// /**
//  * Action
//  */
// export const { increment, decrement, calculate } = callstackSlice.actions;

/**
 * Selector
 */
export const callstackSelectors = callstackAdapter.getSelectors(
  (state: RootState) => state.callstack
);
