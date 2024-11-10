import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type EntityState,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { ArgumentType } from "#/entities/argument/model/argumentObject";
import { type ArrayItemData } from "#/entities/dataStructures/array/model/arraySlice";
import { type ControlledArrayRuntimeOptions } from "#/entities/dataStructures/array/model/arrayStructure";
import type { ExecWorkerInterface } from "#/features/codeRunner/lib/workers/codeExec.worker";
import type { RootState } from "#/store/makeStore";

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
  args: { color?: string | null; animation?: string | null };
  prevArgs?: SetColorFrame["args"];
};

type SetColorMapFrame = CallFrameBase & {
  name: "setColorMap";
  args: { colorMap?: Record<number | string, string> | null };
  prevArgs?: SetColorMapFrame["args"];
};

type SetInfoFrame = NodeFrameBase & {
  name: "setInfo";
  args: { info?: Record<string, any> };
  prevArgs?: SetInfoFrame["args"];
};

type SetHeadersFrame = CallFrameBase & {
  name: "setHeaders";
  args: { colHeaders?: string[]; rowHeaders?: string[] };
  prevArgs?: SetHeadersFrame["args"];
};

type SetValFrame = NodeFrameBase & {
  name: "setVal";
  args: { value?: number | string | null; childName?: string };
  prevArgs?: SetValFrame["args"];
};

type SetChildFrame = NodeFrameBase & {
  name: "setLeftChild" | "setRightChild" | "setNextNode";
  args: { childId: string | null; childTreeName?: string };
  prevArgs?: SetChildFrame["args"];
};

type ShowPointerFrame = NodeFrameBase & {
  name: "showPointer";
  args: { name: string };
  prevArgs?: ShowPointerFrame["args"];
};

type BlinkFrame = NodeFrameBase & {
  name: "blink";
};

type ClearAppearanceFrame = CallFrameBase & {
  name: "clearAppearance";
};

type AddNodeFrame = NodeFrameBase & {
  name: "addNode";
  args: { value: number | string };
  prevArgs?: AddNodeFrame["args"];
};

export type AddArrayItemFrame = NodeFrameBase & {
  name: "addArrayItem";
  args: {
    value?: number | string;
    childName?: string;
    index: number;
    key?: number | string;
  };
  prevArgs?: AddArrayItemFrame["args"];
};

type AddArrayFrame = CallFrameBase & {
  name: "addArray";
  args: {
    arrayData?: EntityState<ArrayItemData, string>;
    options?: ControlledArrayRuntimeOptions;
  };
  prevArgs?: AddArrayFrame["args"];
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
  | SetHeadersFrame
  | SetValFrame
  | SetChildFrame
  | BlinkFrame
  | ShowPointerFrame
  | ClearAppearanceFrame;

const callstackAdapter = createEntityAdapter<CallFrame>({
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
  frames: EntityState<CallFrame, string>;
  frameIndex: number;
  benchmarkResults?: ExecWorkerInterface["benchmark"]["response"];
};

const initialState: CallstackState = {
  isReady: false,
  isPlaying: false,
  result: null,
  runtime: null,
  startTimestamp: null,
  error: null,
  frames: callstackAdapter.getInitialState(),
  frameIndex: -1,
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
    removeOne: (state, action: PayloadAction<string>) => {
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
        Omit<CallstackState, "isPlaying" | "frames" | "frameIndex"> & {
          frames?: CallFrame[];
        }
      >,
    ) => {
      const {
        payload: {
          frames,
          isReady,
          result,
          runtime,
          benchmarkResults,
          startTimestamp,
          error,
        },
      } = action;

      if (frames) {
        callstackAdapter.setAll(state.frames, frames);
      }

      state.isReady = isReady;
      state.frameIndex = -1;
      state.result = result;
      state.runtime = runtime;
      state.benchmarkResults = benchmarkResults;
      state.startTimestamp = startTimestamp;
      state.error = error;
    },
    setPrevArgs: (state, action: PayloadAction<CallFrame>) => {
      const { payload } = action;
      const frame = state.frames.entities[payload.id];
      if (frame && "prevArgs" in frame && "prevArgs" in payload) {
        frame.prevArgs = payload.prevArgs;
      }
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setFrameIndex: (state, action: PayloadAction<number>) => {
      state.frameIndex = action.payload;
    },
  },
});

/**
 * Selectors
 */
export const callstackSelectors = callstackAdapter.getSelectors(
  (state: RootState) => state.callstack.frames,
);

const rootSelectors = callstackAdapter.getSelectors();

export const selectRawCallstack = (state: RootState) => state.callstack;

export const selectCallstack = createSelector(
  (state: RootState) => state.callstack,
  (callstack) => ({
    isReady: callstack.isReady,
    runtime: callstack.runtime,
    benchmarkResults: callstack.benchmarkResults,
    startTimestamp: callstack.startTimestamp,
    result: callstack.result,
    error: callstack.error,
    frames: rootSelectors.selectAll(callstack.frames),
    frameIndex: callstack.frameIndex,
  }),
);

export const selectRuntimeData = createSelector(
  (state: RootState) => state.callstack,
  (callstack) => ({
    isReady: callstack.isReady,
    runtime: callstack.runtime,
    benchmarkResults: callstack.benchmarkResults,
    result: callstack.result,
    error: callstack.error,
  }),
);

export const selectCallstackIsReady = (state: RootState) =>
  state.callstack.isReady;
export const selectCallstackRuntime = (state: RootState) =>
  state.callstack.runtime;
export const selectCallstackResult = (state: RootState) =>
  state.callstack.result;
export const selectCallstackError = (state: RootState) => state.callstack.error;
export const selectBenchmarkResults = (state: RootState) =>
  state.callstack.benchmarkResults;

export const selectCallstackIsPlaying = (state: RootState) =>
  state.callstack.isPlaying;

export const selectCallstackLength = (state: RootState) =>
  state.callstack.frames.ids.length;

export const selectCallstackFrameIndex = (state: RootState) =>
  state.callstack.frameIndex;

export const selectIsRootFrame = (state: RootState) =>
  state.callstack.frameIndex === -1;
export const selectIsLastFrame = (state: RootState) =>
  state.callstack.frameIndex === selectCallstackLength(state) - 1;

export const selectConsoleLogs = createSelector(
  (state: RootState) => state.callstack,
  (callstack) =>
    rootSelectors
      .selectAll(callstack.frames)
      .filter((frame) => frame.name === "consoleLog") as ConsoleLogFrame[],
);

export class CallstackHelper {
  frames: CallFrame[] = [];

  addOne(frame: CallFrame) {
    this.frames.push(frame);
  }

  clear() {
    this.frames = [];
  }
}
