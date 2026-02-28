import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type PyodideProgress = { value: number; stage: string };

type PyodideState = { progress: PyodideProgress | null };

const initialState: PyodideState = { progress: null };

export const pyodideSlice = createSlice({
  name: "PYODIDE",
  initialState,
  reducers: {
    setProgress: (state, action: PayloadAction<PyodideProgress>) => {
      state.progress = action.payload;
    },
    clearProgress: (state) => {
      state.progress = null;
    },
  },
});

export const { setProgress, clearProgress } = pyodideSlice.actions;
