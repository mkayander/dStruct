"use client";

import { useMemo } from "react";

import {
  getCodeKey,
  isLanguageValid,
  type ProgrammingLanguage,
} from "#/features/codeRunner/hooks/useCodeExecution";
import { inferSolutionParameterNames } from "#/features/codeRunner/lib/inferSolutionParameterNames";
import { selectEditorCodeForLanguage } from "#/features/codeRunner/model/editorCodeSlice";
import { useSearchParam } from "#/shared/hooks";
import { useAppSelector } from "#/store/hooks";

export const useSolutionParameterNames = ():
  | readonly (string | undefined)[]
  | undefined => {
  const [languageParam] = useSearchParam<ProgrammingLanguage>("language", {
    defaultValue: "javascript",
    validate: isLanguageValid,
  });
  const language: ProgrammingLanguage =
    languageParam === "" ? "javascript" : languageParam;
  const editorCode = useAppSelector(selectEditorCodeForLanguage(language));

  return useMemo(() => {
    const names = inferSolutionParameterNames(editorCode, language);
    return names ?? undefined;
  }, [editorCode, language]);
};

/** Code field on a solution record for the active editor language. */
export const getSolutionCodeForLanguage = (
  solution: Record<string, string | undefined> | null | undefined,
  language: ProgrammingLanguage,
): string => solution?.[getCodeKey(language)] ?? "";
