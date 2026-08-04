import type { ProgrammingLanguage } from "#/features/codeRunner/hooks/useCodeExecution";
import { inferSolutionParameterNames } from "#/features/codeRunner/lib/inferSolutionParameterNames";
import { solutionParameterNamesSlice } from "#/features/codeRunner/model/solutionParameterNamesSlice";
import type { AppDispatch } from "#/store/makeStore";

/** Parse solution signature and store parameter names for the active language. */
export const syncSolutionParameterNamesFromCode = (
  dispatch: AppDispatch,
  language: ProgrammingLanguage,
  code: string,
): void => {
  dispatch(
    solutionParameterNamesSlice.actions.setParameterNames({
      language,
      names: inferSolutionParameterNames(code, language),
    }),
  );
};
