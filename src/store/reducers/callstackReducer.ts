import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type EntityState,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { RootState } from "#/store/makeStore";
import { type ArgumentType } from "#/utils/argumentObject";

export type CallFrameBase = {
  id: string;
  timestamp: number;
  treeName: string;
  structureType: "treeNode" | "array";
  argType: ArgumentType;
};

type RuntimeErrorFrame = {
  id: string;
  timestamp: number;
  name: "error";
};

type NodeFrameBase = CallFrameBase & {
  nodeId: string;
};

type SetColorFrameFn = (color: string | null, animation?: string) => void;
type SetColorFrame = NodeFrameBase & {
  name: "setColor";
  args: Parameters<SetColorFrameFn>;
};

type SetColorMapFrame = CallFrameBase & {
  name: "setColorMap";
  args: [Record<number | string, string>];
};

type SetValFrame = NodeFrameBase & {
  name: "setVal";
  args: [number | string | null];
};

type SetChildFrame = NodeFrameBase & {
  name: "setLeftChild" | "setRightChild" | "setNextNode";
  args: [string | null, string | undefined];
};

type ShowPointerFrame = NodeFrameBase & {
  name: "showPointer";
  args: [];
};

type BlinkFrame = NodeFrameBase & {
  name: "blink";
  args: [];
};

type AddNodeFrame = NodeFrameBase & {
  name: "addNode";
  args: [number | string];
};

type AddArrayItemFrame = NodeFrameBase & {
  name: "addArrayItem";
  args: [number | string, number];
};

type DeleteNodeFrame = NodeFrameBase & {
  name: "deleteNode";
  args: [];
};

export type CallFrame =
  | RuntimeErrorFrame
  | AddNodeFrame
  | AddArrayItemFrame
  | DeleteNodeFrame
  | SetColorFrame
  | SetColorMapFrame
  | SetValFrame
  | SetChildFrame
  | BlinkFrame
  | ShowPointerFrame;

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
  startTimestamp: number | null;
  error: Error | null;
  frames: EntityState<CallFrame>;
};

const initialState: CallstackState = {
  isReady: false,
  result: null,
  runtime: null,
  startTimestamp: null,
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
      state.startTimestamp = null;
      state.error = null;
      callstackAdapter.removeAll(state.frames);
    },
    setStatus: (
      state,
      action: PayloadAction<
        Pick<
          CallstackState,
          "isReady" | "result" | "runtime" | "startTimestamp" | "error"
        >
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
    startTimestamp: callstack.startTimestamp,
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

export const selectCallstackIsReady = createSelector(
  (state: RootState) => state.callstack,
  (callstack: CallstackState) => callstack.isReady
);
