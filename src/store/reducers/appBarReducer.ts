import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "#/store/makeStore";

/**
 * Payload
 */
export type AppBarPayload = {
  inputNumber: number;
};

/**
 * State
 */
export type AppBarState = {
  isScrolled: boolean;
};

const initialState: AppBarState = {
  isScrolled: false,
};

/**
 * Slice
 * @see https://redux-toolkit.js.org/api/createslice
 */
export const appBarSlice = createSlice({
  name: "APP_BAR",
  initialState,
  reducers: {
    setIsScrolled: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isScrolled: action.payload,
    }),
  },
});

/**
 * Reducer
 */
export const appBarReducer = appBarSlice.reducer;

/**
 * Selectors
 */
export const selectIsAppBarScrolled = (state: RootState): boolean =>
  state.appBar.isScrolled;
