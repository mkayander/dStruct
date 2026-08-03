import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ProgrammingLanguage } from "#/features/codeRunner/hooks/useCodeExecution";
import type { RootState } from "#/store/makeStore";

type EditorCodeState = {
  javascript: string;
  python: string;
};

const initialState: EditorCodeState = {
  javascript: "",
  python: "",
};

export const editorCodeSlice = createSlice({
  name: "EDITOR_CODE",
  initialState,
  reducers: {
    setCode: (
      state,
      action: PayloadAction<{ language: ProgrammingLanguage; code: string }>,
    ) => {
      const { language, code } = action.payload;
      if (language === "python") {
        state.python = code;
      } else {
        state.javascript = code;
      }
    },
  },
});

export const selectEditorCodeForLanguage =
  (language: ProgrammingLanguage) => (state: RootState) =>
    language === "python"
      ? state.editorCode.python
      : state.editorCode.javascript;
