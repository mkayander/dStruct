"use client";

import { useEffect, useMemo } from "react";

import { projectSlice } from "#/features/project/model/projectSlice";
import { usePlaygroundRoute } from "#/shared/hooks/usePlaygroundRoute";
import {
  buildPlaygroundPath,
  parsePlaygroundPathname,
} from "#/shared/lib/playgroundRoute";
import {
  getLastPlaygroundPath,
  getRestorablePlaygroundPath,
  removeLastPlaygroundPath,
  setLastPlaygroundPath,
} from "#/shared/local-storage/playgroundPath";
import { useAppDispatch } from "#/store/hooks";

export const usePlaygroundSlugs = () => {
  const dispatch = useAppDispatch();
  const route = usePlaygroundRoute();

  useEffect(() => {
    if (!route?.slug[0]) {
      return;
    }
    setLastPlaygroundPath(route.pathname);
  }, [route]);

  return useMemo(() => {
    if (!route) {
      return {
        projectSlug: undefined,
        caseSlug: undefined,
        solutionSlug: undefined,
        setProject: () => undefined,
        setCase: () => undefined,
        setSolution: () => undefined,
        clearSlugs: () => undefined,
      } as const;
    }

    const [projectSlug, caseSlug, solutionSlug] = route.slug;
    const { basePath, navigateTo } = route;

    const setProject = (slug?: string, isInitial?: boolean) => {
      dispatch(projectSlice.actions.loadStart());
      if (!slug) {
        return navigateTo(basePath, {
          replace: true,
          omitView: true,
        });
      }

      const lastPath = getLastPlaygroundPath();
      const lastParsed = lastPath ? parsePlaygroundPathname(lastPath) : null;
      if (lastPath && !lastParsed) {
        removeLastPlaygroundPath();
      }
      const pathToRestore = isInitial
        ? getRestorablePlaygroundPath(lastPath, basePath)
        : null;

      if (pathToRestore) {
        return navigateTo(pathToRestore, { replace: true, omitView: true });
      }

      return navigateTo(buildPlaygroundPath(basePath, [slug]), {
        replace: true,
        omitView: true,
      });
    };

    const setCase = (slug: string) => {
      if (!projectSlug) throw new Error("Project id must be set first");

      if (!slug) return setProject(projectSlug);

      if (slug === caseSlug) return;

      const caseSegments = solutionSlug
        ? [projectSlug, slug, solutionSlug]
        : [projectSlug, slug];

      return navigateTo(buildPlaygroundPath(basePath, caseSegments), {
        replace: !caseSlug,
      });
    };

    const setSolution = (slug: string) => {
      if (!projectSlug || !caseSlug)
        throw new Error("Project and case ids must be set first");

      if (slug === solutionSlug) return;

      return navigateTo(
        buildPlaygroundPath(basePath, [projectSlug, caseSlug, slug]),
        { replace: !solutionSlug },
      );
    };

    const clearSlugs = () => {
      removeLastPlaygroundPath();
      return navigateTo(basePath, { omitView: true });
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
  }, [dispatch, route]);
};
