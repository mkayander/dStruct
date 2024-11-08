import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type EntityState,
  type PayloadAction,
} from "@reduxjs/toolkit";
import shortUUID from "short-uuid";

import type { ArgumentArrayType } from "#/entities/argument/model/types";
import { type ControlledArrayRuntimeOptions } from "#/hooks/dataStructures/arrayStructure";
import type { RootState } from "#/store/makeStore";
import {
  type BaseStructureItem,
  type BaseStructureState,
  getBaseStructureReducers,
  getInitialDataBase,
  getStateByName,
  type NamedPayload,
  type StructureNode,
} from "#/store/reducers/structures/baseStructureReducer";

const uuid = shortUUID();

export type ArrayItemData = StructureNode & {
  index: number;
  key?: string | number;
};

export type ArrayData = BaseStructureItem<ArrayItemData> & {
  order: number;
  argType: ArgumentArrayType;
  parentName?: string;
  childNames?: string[];
  colHeaders?: string[];
  rowHeaders?: string[];
};

export type ArrayDataState = BaseStructureState<ArrayData>;

export const arrayDataAdapter = createEntityAdapter<ArrayItemData>({
  sortComparer: (a, b) => a.index - b.index,
});

const getInitialData = (
  order: number,
  argType: ArgumentArrayType,
  parentName?: string,
  childNames?: string[],
): ArrayData => ({
  ...getInitialDataBase(arrayDataAdapter),
  order,
  argType,
  parentName,
  childNames,
});

const initialState: ArrayDataState = {};

const baseStructureReducers =
  getBaseStructureReducers<ArrayItemData>(arrayDataAdapter);

/**
 * Slice
 * @see https://redux-toolkit.js.org/api/createslice
 */
export const arrayStructureSlice = createSlice({
  name: "ARRAY_STRUCTURE",
  initialState,
  reducers: {
    ...baseStructureReducers,
    init: (
      state,
      action: PayloadAction<{
        name: string;
        parentName?: string;
        childNames?: string[];
        order: number;
        argType: ArgumentArrayType;
      }>,
    ) => {
      const { name, order, argType, parentName, childNames } = action.payload;
      state[name] = getInitialData(order, argType, parentName, childNames);
    },
    create: (
      state,
      action: NamedPayload<{
        argType: ArgumentArrayType;
        nodes?: EntityState<ArrayItemData, string>;
        options?: ControlledArrayRuntimeOptions;
      }>,
    ) => {
      const {
        payload: {
          name,
          data: { argType, nodes, options },
        },
      } = action;
      const { colorMap } = options ?? {};
      const treeState = {
        ...getInitialData(999, argType),
        isRuntime: true,
      };
      if (nodes) {
        treeState.nodes = nodes;
      }

      if (colorMap) {
        treeState.colorMap = colorMap;
      }

      state[name] = treeState;
    },
    delete: (state, action: NamedPayload<void>) => {
      const { name } = action.payload;
      delete state[name];
    },
    setHeaders: (
      state,
      action: NamedPayload<{
        colHeaders?: string[];
        rowHeaders?: string[];
      }>,
    ) => {
      const {
        payload: { name, data },
      } = action;
      const treeState = getStateByName(state, name);
      if (!treeState) return;

      treeState.colHeaders = data.colHeaders;
      treeState.rowHeaders = data.rowHeaders;
    },
  },
});

export const generateArrayData = (array: Array<any>) => {
  const data = arrayDataAdapter.getInitialState();

  for (const [index, value] of array.entries()) {
    const id = uuid.generate();
    data.ids.push(id);
    data.entities[id] = {
      id,
      index,
      value,
    };
  }

  return data;
};

/**
 * Reducer
 */
export const arrayStructureReducer = arrayStructureSlice.reducer;

/**
 * Selector
 */
export const arrayDataSelector = (state: RootState) => state.arrayStructure;

export const arrayDataItemSelectors = arrayDataAdapter.getSelectors();

export const selectArrayItemDataById = (name: string, id: string) =>
  createSelector(arrayDataSelector, (state) => {
    const treeState = getStateByName(state, name);
    if (!treeState) return null;

    return arrayDataItemSelectors.selectById(treeState.nodes, id);
  });

export const selectArrayStateByName = (name: string) =>
  createSelector(arrayDataSelector, (state) => {
    const treeState = getStateByName(state, name);
    if (!treeState) return null;

    return treeState;
  });
