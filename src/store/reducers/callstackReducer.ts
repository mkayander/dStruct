import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type EntityState,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { RootState } from "#/store/makeStore";

export type CallFrame = {
  id: string;
  nodeId: string;
  // order: number;
  name: string;
  args: any[];
  timestamp: number;
};

const callstackAdapter = createEntityAdapter<CallFrame>({
  selectId: (frame) => frame.id,
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
  result: string | number | null;
  runtime: number | null;
  error: Error | null;
  frames: EntityState<CallFrame>;
};

const initialState: CallstackState = {
  isReady: false,
  result: null,
  runtime: null,
  error: null,
  frames: callstackAdapter.getInitialState(),
};

/**
 * Slice
 * @see https://redux-toolkit.js.org/api/createslice
 */
export const callstackSlice = createSlice({
  name: "CALLSTACK",
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
      state.result = null;
      state.runtime = null;
      state.error = null;
      callstackAdapter.removeAll(state.frames);
    },
    setStatus: (
      state,
      action: PayloadAction<
        Pick<CallstackState, "isReady" | "result" | "runtime" | "error">
      >
    ) => {
      const { payload } = action;

      return {
        ...state,
        ...payload,
      };
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
    runtime: callstack.runtime,
    result: callstack.result,
    error: callstack.error,
    frames: rootSelectors.selectAll(callstack.frames),
  })
);

export const selectRuntimeData = createSelector(
  (state: RootState) => state.callstack,
  (callstack) => ({
    isReady: callstack.isReady,
    runtime: callstack.runtime,
    result: callstack.result,
    error: callstack.error,
  })
);
