import {
  createEntityAdapter,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { RootState } from "#/store/makeStore";
import {
  type BaseStructureItem,
  type BaseStructureState,
  getBaseStructureReducers,
  getInitialDataBase,
  getStateByName,
  type StructureNode,
} from "#/store/reducers/structures/structureUtils";

export type ArrayItemData = StructureNode & {
  index: number;
};

export type ArrayData = BaseStructureItem<ArrayItemData> & {
  order: number;
};

export type ArrayDataState = BaseStructureState<ArrayData>;

const arrayDataAdapter = createEntityAdapter<ArrayItemData>({
  selectId: (node: ArrayItemData) => node.id,
  sortComparer: (a, b) => a.index - b.index,
});

const getInitialData = (order: number): ArrayData => ({
  ...getInitialDataBase(arrayDataAdapter),
  order,
});
const initialState: ArrayDataState = {};

/**
 * Slice
 * @see https://redux-toolkit.js.org/api/createslice
 */
export const arrayStructureSlice = createSlice({
  name: "ARRAY_STRUCTURE",
  initialState,
  reducers: {
    ...getBaseStructureReducers(arrayDataAdapter),
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
  },
});

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
