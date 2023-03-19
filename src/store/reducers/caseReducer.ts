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

const argumentObjectValidator = z.object({
  name: z.string(),
  type: z.nativeEnum(ArgumentType),
  order: z.number(),
  input: z.string(),
});

export const isArgumentObjectValid = (
  args: unknown
): args is Record<string, ArgumentObject> => {
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
};

const initialState: CaseState = {
  args: argumentAdapter.getInitialState(),
};

export const caseSlice = createSlice({
  name: "CASE",
  initialState,
  reducers: {
    addArgument: (state, action: PayloadAction<ArgumentObject>) => {
      const { payload } = action;
      argumentAdapter.addOne(state.args, payload);
    },
    removeArgument: (state, action: PayloadAction<string>) => {
      const { payload } = action;
      argumentAdapter.removeOne(state.args, payload);
    },
    updateArgument: (state, action: PayloadAction<ArgumentObject>) => {
      const { payload } = action;
      argumentAdapter.updateOne(state.args, {
        id: payload.name,
        changes: payload,
      });
    },
    setArguments: (state, action: PayloadAction<ArgumentObject[]>) => {
      const { payload } = action;
      argumentAdapter.setAll(state.args, payload);
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
