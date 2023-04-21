import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type EntityState,
  type PayloadAction,
} from "@reduxjs/toolkit";
import shortUUID from "short-uuid";

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
};

export type ArrayData = BaseStructureItem<ArrayItemData> & {
  order: number;
};

export type ArrayDataState = BaseStructureState<ArrayData>;

export const arrayDataAdapter = createEntityAdapter<ArrayItemData>({
  selectId: (node: ArrayItemData) => node.id,
  sortComparer: (a, b) => a.index - b.index,
});

const getInitialData = (order: number): ArrayData => ({
  ...getInitialDataBase(arrayDataAdapter),
  order,
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
        order: number;
      }>
    ) => {
      const { name, order } = action.payload;
      state[name] = getInitialData(order);
    },
    create: (state, action: NamedPayload<EntityState<ArrayItemData>>) => {
      const {
        payload: { name, data },
      } = action;
      const treeState = { ...getInitialData(999), isRuntime: true };

      treeState.nodes = data;

      state[name] = treeState;
    },
  },
});

export const generateArrayData = (array: Array<number | string>) => {
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

  // arrayDataAdapter.addMany(
  //   data,
  //   array.map((value, index) => ({
  //     id: uuid.generate(),
  //     index,
  //     value,
  //   }))
  // );

  console.log("generateArrayData", { data });

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

export const selectAllArrayData = (name: string) =>
  createSelector(arrayDataSelector, (state) => {
    const treeState = getStateByName(state, name);
    if (!treeState) return [];

    return arrayDataItemSelectors.selectAll(treeState.nodes);
  });

export const selectArrayItemDataById = (name: string, id: string) =>
  createSelector(arrayDataSelector, (state) => {
    const treeState = getStateByName(state, name);
    if (!treeState) return null;

    return arrayDataItemSelectors.selectById(treeState.nodes, id);
  });
