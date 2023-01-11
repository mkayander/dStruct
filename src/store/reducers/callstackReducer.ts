import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type EntityState,
  type PayloadAction,
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
export type CallstackState = {
  isReady: boolean;
  frames: EntityState<CallFrame>;
};

const initialState: CallstackState = {
  isReady: false,
  frames: callstackAdapter.getInitialState(),
};

/**
 * Slice
 * @see https://redux-toolkit.js.org/api/createslice
 */
export const callstackSlice = createSlice({
  name: 'CALLSTACK',
  initialState,
  reducers: {
    addOne: (state, action: PayloadAction<CallFrame>) => {
      const { payload } = action;
      callstackAdapter.addOne(state.frames, payload);
    },
    addMany: (state, action: PayloadAction<CallFrame[]>) => {
      const { payload } = action;
      callstackAdapter.addMany(state.frames, payload);
    },
    removeOne: (state, action: PayloadAction<number>) => {
      const { payload } = action;
      callstackAdapter.removeOne(state.frames, payload);
    },
    removeAll: (state) => {
      state.isReady = false;
      callstackAdapter.removeAll(state.frames);
    },
    setStatus: (
      state,
      action: PayloadAction<Pick<CallstackState, 'isReady'>>
    ) => {
      const {
        payload: { isReady },
      } = action;
      state.isReady = isReady;
    },
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
 * Selectors
 */
export const callstackSelectors = callstackAdapter.getSelectors(
  (state: RootState) => state.callstack.frames
);

const rootSelectors = callstackAdapter.getSelectors();

export const selectCallstack = createSelector(
  (state: RootState) => state.callstack,
  (callstack) => ({
    isReady: callstack.isReady,
    frames: rootSelectors.selectAll(callstack.frames),
  })
);
