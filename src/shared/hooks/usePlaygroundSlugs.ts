"use client";

import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

import { projectSlice } from "#/features/project/model/projectSlice";
import {
  getLastPlaygroundPath,
  getRestorablePlaygroundPath,
  PLAYGROUND_BASE_PATH,
  removeLastPlaygroundPath,
  setLastPlaygroundPath,
} from "#/shared/local-storage/playgroundPath";
import { useAppDispatch } from "#/store/hooks";

export const usePlaygroundSlugs = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const currentPath = router.asPath;
    if (!currentPath.startsWith(PLAYGROUND_BASE_PATH)) return;

    const projectSlug = currentPath.split("/")[2];
    if (!projectSlug) return;

    setLastPlaygroundPath(currentPath);
  }, [router.asPath]);

  return useMemo(() => {
    const [projectSlug, caseSlug, solutionSlug] = Array.isArray(
      router.query.slug,
    )
      ? router.query.slug
      : [];

    const setProject = (slug?: string, isInitial?: boolean) => {
      dispatch(projectSlice.actions.loadStart());
      if (!slug) return router.replace(PLAYGROUND_BASE_PATH);

      const lastPath = getLastPlaygroundPath();
      if (lastPath && !lastPath.startsWith(PLAYGROUND_BASE_PATH)) {
        removeLastPlaygroundPath();
      }
      const pathToRestore = isInitial
        ? getRestorablePlaygroundPath(lastPath)
        : null;

      if (pathToRestore) {
        return router.replace(pathToRestore);
      }

      return router.replace(`${PLAYGROUND_BASE_PATH}/${slug}`);
    };

    const setCase = (slug: string) => {
      if (!projectSlug) throw new Error("Project id must be set first");

      if (!slug) return setProject(projectSlug);

      if (slug === caseSlug) return;

      return router[caseSlug ? "push" : "replace"](
        `${PLAYGROUND_BASE_PATH}/${projectSlug}/${slug}/${solutionSlug ?? ""}`,
      );
    };

    const setSolution = (slug: string) => {
      if (!projectSlug || !caseSlug)
        throw new Error("Project and case ids must be set first");

      if (slug === solutionSlug) return;

      return router[solutionSlug ? "push" : "replace"](
        `${PLAYGROUND_BASE_PATH}/${projectSlug}/${caseSlug}/${slug}`,
      );
    };

    const clearSlugs = () => {
      removeLastPlaygroundPath();
      return router.push(PLAYGROUND_BASE_PATH);
    };

    return {
      projectSlug,
      caseSlug,
      solutionSlug,
      setProject,
      setCase,
      setSolution,
      clearSlugs,
    } as const;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug]);
};
