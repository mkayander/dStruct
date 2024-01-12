import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type EntityState,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { type ControlledArrayRuntimeOptions } from "#/hooks/dataStructures/arrayStructure";
import type { RootState } from "#/store/makeStore";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";
import { type ArgumentType } from "#/utils/argumentObject";

export type StructureTypeName = "treeNode" | "array";

export type CallFrameBase = {
  id: string;
  timestamp: number;
  treeName: string;
  structureType: StructureTypeName;
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

type SetColorFrame = NodeFrameBase & {
  name: "setColor";
  args: { color: string | null; animation?: string };
};

type SetColorMapFrame = CallFrameBase & {
  name: "setColorMap";
  args: { colorMap: Record<number | string, string> };
};

type SetInfoFrame = NodeFrameBase & {
  name: "setInfo";
  args: { info: Record<string, any> };
};

type SetValFrame = NodeFrameBase & {
  name: "setVal";
  args: { value: number | string | null; childName?: string };
};

type SetChildFrame = NodeFrameBase & {
  name: "setLeftChild" | "setRightChild" | "setNextNode";
  args: { childId: string | null; childTreeName?: string };
};

type ShowPointerFrame = NodeFrameBase & {
  name: "showPointer";
  args: { name: string };
};

type BlinkFrame = NodeFrameBase & {
  name: "blink";
};

type AddNodeFrame = NodeFrameBase & {
  name: "addNode";
  args: { value: number | string };
};

export type AddArrayItemFrame = NodeFrameBase & {
  name: "addArrayItem";
  args: {
    value?: number | string;
    childName?: string;
    index: number;
    key?: number | string;
  };
};

type AddArrayFrame = CallFrameBase & {
  name: "addArray";
  args: {
    arrayData?: EntityState<ArrayItemData>;
    options?: ControlledArrayRuntimeOptions;
  };
};

type DeleteNodeFrame = NodeFrameBase & {
  name: "deleteNode";
};

type ConsoleLogFrame = {
  id: string;
  timestamp: number;
  name: "consoleLog";
  args: string[];
};

export type CallFrame =
  | RuntimeErrorFrame
  | ConsoleLogFrame
  | AddNodeFrame
  | AddArrayItemFrame
  | AddArrayFrame
  | DeleteNodeFrame
  | SetColorFrame
  | SetColorMapFrame
  | SetInfoFrame
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
  isPlaying: boolean;
  result: string | number | null;
  runtime: number | null;
  startTimestamp: number | null;
  error: Error | null;
  frames: EntityState<CallFrame>;
};

const initialState: CallstackState = {
  isReady: false,
  isPlaying: false,
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
      >,
    ) => {
      const { payload } = action;

      return {
        ...state,
        ...payload,
      };
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
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
  (state: RootState) => state.callstack.frames,
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
  }),
);

export const selectRuntimeData = createSelector(
  (state: RootState) => state.callstack,
  (callstack) => ({
    isReady: callstack.isReady,
    runtime: callstack.runtime,
    result: callstack.result,
    error: callstack.error,
  }),
);

export const selectCallstackIsReady = createSelector(
  (state: RootState) => state.callstack,
  (callstack: CallstackState) => callstack.isReady,
);

export const selectCallstackIsPlaying = createSelector(
  (state: RootState) => state.callstack,
  (callstack: CallstackState) => callstack.isPlaying,
);

export const selectCallstackLength = createSelector(
  (state: RootState) => state.callstack,
  (callstack: CallstackState) => callstack.frames.ids.length,
);

export const selectConsoleLogs = createSelector(
  (state: RootState) => state.callstack,
  (callstack) =>
    rootSelectors
      .selectAll(callstack.frames)
      .filter((frame) => frame.name === "consoleLog") as ConsoleLogFrame[],
);
