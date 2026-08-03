"use client";

import { useMemo } from "react";

import {
  getCodeKey,
  isLanguageValid,
  type ProgrammingLanguage,
} from "#/features/codeRunner/hooks/useCodeExecution";
import { inferSolutionParameterNames } from "#/features/codeRunner/lib/inferSolutionParameterNames";
import { selectEditorCodeForLanguage } from "#/features/codeRunner/model/editorCodeSlice";
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
 * Uses live editor text when available; otherwise falls back to the saved solution
 * (needed when TreeView mounts before CodePanel, e.g. mobile results).
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

  const editorCode = useAppSelector(selectEditorCodeForLanguage(language));
  const solutionCode = getSolutionCodeForLanguage(
    currentSolution.data,
    language,
  );
  const effectiveCode =
    editorCode.trim().length > 0 ? editorCode : solutionCode;

  return useMemo(() => {
    const names = inferSolutionParameterNames(effectiveCode, language);
    return names ?? undefined;
  }, [effectiveCode, language]);
};
