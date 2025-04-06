import {
  createEntityAdapter,
  createSlice,
  type EntityState,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  ArgumentObject,
  ArgumentTreeType,
} from "#/entities/argument/model/types";
import type { RootState } from "#/store/makeStore";

const argumentAdapter = createEntityAdapter<ArgumentObject, string>({
  selectId: (arg) => arg.name,
  sortComparer: (a, b) => a.order - b.order,
});

export type ArgumentInfo = {
  isParsed?: boolean;
};

type CaseState = {
  projectId: string | null;
  caseId: string | null;
  args: EntityState<ArgumentObject, string>;
  info: Record<string, ArgumentInfo>;
  isEdited: boolean;
};

const initialState: CaseState = {
  projectId: null,
  caseId: null,
  args: argumentAdapter.getInitialState(),
  info: {},
  isEdited: false,
};

export const caseSlice = createSlice({
  name: "CASE",
  initialState,
  reducers: {
    addArgument: (state, action: PayloadAction<ArgumentObject>) => {
      argumentAdapter.addOne(state.args, action.payload);
      state.isEdited = true;
    },
    removeArgument: (state, action: PayloadAction<ArgumentObject>) => {
      const { name } = action.payload;
      argumentAdapter.removeOne(state.args, name);
      state.isEdited = true;
      delete state.info[name];
    },
    updateArgument: (state, action: PayloadAction<ArgumentObject>) => {
      const { payload } = action;
      argumentAdapter.updateOne(state.args, {
        id: payload.name,
        changes: payload,
      });
      state.isEdited = true;
      state.info[payload.name] = {
        isParsed: false,
      };
    },
    updateNodeData: (
      state,
      action: PayloadAction<ArgumentObject<ArgumentTreeType>>,
    ) => {
      const payload = action.payload;
      const name = payload.name;

      argumentAdapter.updateOne(state.args, {
        id: name,
        changes: {
          nodeData: payload.nodeData,
        },
      });
    },
    clearNodeData: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      if (!state.args.entities[name]) return;

      argumentAdapter.updateOne(state.args, {
        id: name,
        changes: {
          nodeData: {},
        },
      });
      state.info[name] = {
        isParsed: false,
      };
    },
    setArguments: (
      state,
      action: PayloadAction<{
        projectId: string;
        caseId: string;
        data: ArgumentObject[];
        resetInfoState?: boolean;
      }>,
    ) => {
      const { data, resetInfoState } = action.payload;
      state.projectId = action.payload.projectId;
      state.caseId = action.payload.caseId;
      argumentAdapter.setAll(state.args, data);
      state.isEdited = false;
      if (resetInfoState) {
        state.info = {};
      }
    },
    updateArgumentInfo: (
      state,
      action: PayloadAction<{ name: string; data: ArgumentInfo }>,
    ) => {
      const { name, data } = action.payload;
      if (!state.args.entities[name]) return;
      Object.assign((state.info[name] ??= {}), data);
    },
    reorderArgument: (
      state,
      action: PayloadAction<{ oldIndex: number; newIndex: number }>,
    ) => {
      const { oldIndex, newIndex } = action.payload;

      const args = argumentAdapter.getSelectors().selectAll(state.args);
      const from = args[oldIndex];
      const to = args[newIndex];
      if (!from || !to) return;

      argumentAdapter.updateOne(state.args, {
        id: from.name,
        changes: {
          order: newIndex,
        },
      });
      argumentAdapter.updateOne(state.args, {
        id: to.name,
        changes: {
          order: oldIndex,
        },
      });
    },
    clear: () => ({ ...initialState }),
  },
});

/**
 * Selectors
 */
export const caseArgumentSelector = argumentAdapter.getSelectors();

export const selectCaseArguments = (state: RootState) =>
  caseArgumentSelector.selectAll(state.testCase.args);

export const selectCaseIsEdited = (state: RootState) => state.testCase.isEdited;

export const selectCaseArgumentsInfo = (state: RootState) =>
  state.testCase.info;
