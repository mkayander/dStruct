import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type BenchmarkProgress = { current: number; total: number };

type BenchmarkState = { progress: BenchmarkProgress | null };

const initialState: BenchmarkState = { progress: null };

export const benchmarkSlice = createSlice({
  name: "BENCHMARK",
  initialState,
  reducers: {
    setProgress: (state, action: PayloadAction<BenchmarkProgress>) => {
      state.progress = action.payload;
    },
    clearProgress: (state) => {
      state.progress = null;
    },
  },
});

export const { setProgress, clearProgress } = benchmarkSlice.actions;
