import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ProgrammingLanguage } from "#/features/codeRunner/hooks/useCodeExecution";
import type { RootState } from "#/store/makeStore";

type SolutionParameterNamesState = {
  javascript?: readonly (string | undefined)[];
  python?: readonly (string | undefined)[];
};

const initialState: SolutionParameterNamesState = {};

export const solutionParameterNamesSlice = createSlice({
  name: "SOLUTION_PARAMETER_NAMES",
  initialState,
  reducers: {
    setParameterNames: (
      state,
      action: PayloadAction<{
        language: ProgrammingLanguage;
        names: readonly (string | undefined)[] | null;
      }>,
    ) => {
      const { language, names } = action.payload;
      if (names === null) {
        if (language === "python") {
          delete state.python;
        } else {
          delete state.javascript;
        }
        return;
      }
      if (language === "python") {
        state.python = [...names];
      } else {
        state.javascript = [...names];
      }
    },
    clearAll: () => initialState,
  },
});

export const selectSolutionParameterNamesForLanguage =
  (language: ProgrammingLanguage) =>
  (state: RootState): readonly (string | undefined)[] | undefined =>
    language === "python"
      ? state.solutionParameterNames.python
      : state.solutionParameterNames.javascript;
