"use client";

import { useMemo } from "react";

import {
  getCodeKey,
  isLanguageValid,
  type ProgrammingLanguage,
} from "#/features/codeRunner/hooks/useCodeExecution";
import { inferSolutionParameterNames } from "#/features/codeRunner/lib/inferSolutionParameterNames";
import { selectSolutionParameterNamesForLanguage } from "#/features/codeRunner/model/solutionParameterNamesSlice";
import type { RouterOutputs } from "#/shared/api";
import { api } from "#/shared/api";
import { usePlaygroundSlugs, useSearchParam } from "#/shared/hooks";
import { useAppSelector } from "#/store/hooks";

type SolutionBySlug = RouterOutputs["project"]["getSolutionBySlug"];

/** Code field on a solution record for the active editor language. */
export const getSolutionCodeForLanguage = (
  solution: SolutionBySlug | null | undefined,
  language: ProgrammingLanguage,
): string => {
  if (!solution) return "";
  const code = solution[getCodeKey(language)];
  return code ?? "";
};

/**
 * Inferred solution parameter names for the active language (JS or Python).
 * Names are set when code runs (or once when the saved solution loads in CodePanel).
 * Falls back to parsing the saved solution when Redux has no names yet (e.g. mobile
 * results before CodePanel mounts).
 */
export const useSolutionParameterNames = ():
  | readonly (string | undefined)[]
  | undefined => {
  const { projectSlug = "", solutionSlug = "" } = usePlaygroundSlugs();
  const [languageParam] = useSearchParam<ProgrammingLanguage>("language", {
    defaultValue: "javascript",
    validate: isLanguageValid,
  });
  const language: ProgrammingLanguage =
    languageParam === "" ? "javascript" : languageParam;

  const selectedProject = api.project.getBySlug.useQuery(projectSlug, {
    enabled: Boolean(projectSlug),
  });
  const currentSolution = api.project.getSolutionBySlug.useQuery(
    {
      projectId: selectedProject.data?.id || "",
      slug: solutionSlug,
    },
    {
      enabled: Boolean(selectedProject.data?.id && solutionSlug),
    },
  );

  const namesFromRun = useAppSelector(
    selectSolutionParameterNamesForLanguage(language),
  );
  const solutionCode = getSolutionCodeForLanguage(
    currentSolution.data,
    language,
  );

  return useMemo(() => {
    if (namesFromRun) return namesFromRun;
    if (!solutionCode.trim()) return undefined;
    return inferSolutionParameterNames(solutionCode, language) ?? undefined;
  }, [language, namesFromRun, solutionCode]);
};
