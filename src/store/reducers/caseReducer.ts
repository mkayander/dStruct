import {
  createEntityAdapter,
  createSlice,
  type EntityState,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { z } from "zod";

import type { RootState } from "#/store/makeStore";

export enum ArgumentType {
  "BINARY_TREE" = "binaryTree",
  "ARRAY" = "array",
  "STRING" = "string",
  "NUMBER" = "number",
  "BOOLEAN" = "boolean",
}

export type ArgumentObject = {
  name: string;
  type: ArgumentType;
  order: number;
  input: string;
};

export type ArgumentObjectMap = Record<string, ArgumentObject>;

export const argumentObjectValidator = z.object({
  name: z.string(),
  type: z.nativeEnum(ArgumentType),
  order: z.number(),
  input: z.string(),
});

export const isArgumentObjectValid = (
  args: unknown
): args is ArgumentObjectMap => {
  if (typeof args !== "object" || args === null) {
    return false;
  }

  for (const arg of Object.values(args)) {
    if (typeof arg !== "object" || arg === null) {
      return false;
    }
    if (!argumentObjectValidator.safeParse(arg).success) {
      return false;
    }
  }

  return true;
};

const argumentAdapter = createEntityAdapter<ArgumentObject>({
  selectId: (arg) => arg.name,
  sortComparer: (a, b) => a.order - b.order,
});

type CaseState = {
  args: EntityState<ArgumentObject>;
  isEdited: boolean;
};

const initialState: CaseState = {
  args: argumentAdapter.getInitialState(),
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
      argumentAdapter.removeOne(state.args, action.payload.name);
      state.isEdited = true;
    },
    updateArgument: (state, action: PayloadAction<ArgumentObject>) => {
      const { payload } = action;
      argumentAdapter.updateOne(state.args, {
        id: payload.name,
        changes: payload,
      });
      state.isEdited = true;
    },
    setArguments: (state, action: PayloadAction<ArgumentObject[]>) => {
      argumentAdapter.setAll(state.args, action.payload);
      state.isEdited = false;
    },
    clear: () => ({ ...initialState }),
  },
});

/**
 * Reducer
 */
export const caseReducer = caseSlice.reducer;

/**
 * Selectors
 */
export const caseArgumentSelector = argumentAdapter.getSelectors();

export const selectCaseArguments = (state: RootState) =>
  caseArgumentSelector.selectAll(state.testCase.args);

export const selectCaseIsEdited = (state: RootState) => state.testCase.isEdited;
