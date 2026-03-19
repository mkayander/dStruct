"use client";

import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";

import { callstackSlice } from "#/features/callstack/model/callstackSlice";
import { projectSlice } from "#/features/project/model/projectSlice";
import { useHasMounted, usePrevious } from "#/shared/hooks";
import {
  getLastPlaygroundPath,
  isValidLastPlaygroundPath,
} from "#/shared/local-storage/playgroundPath";
import { useAppDispatch } from "#/store/hooks";

import {
  isPlaygroundView,
  type PlaygroundView,
  usePlaygroundViewParam,
} from "./usePlaygroundViewParam";

export type { PlaygroundView } from "./usePlaygroundViewParam";

/**
 * Manages the mobile playground phase via the `?view=` query parameter.
 *
 * - **Implicit code with a slug**: if `view` is absent, shallow `replace` adds `?view=code`.
 * - **Tab changes**: shallow `router.replace` (no extra history entries per tab tap).
 */
export const useMobilePlaygroundView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hasMounted = useHasMounted();

  const { view, setView } = usePlaygroundViewParam();

  const hasProjectSlug = useMemo(() => {
    const slugs = router.query.slug;
    return Array.isArray(slugs) && slugs.length > 0;
  }, [router.query.slug]);

  const currentView: PlaygroundView = useMemo(() => {
    if (view && isPlaygroundView(view)) {
      return view;
    }

    if (hasProjectSlug) {
      return "code";
    }

    // Avoid localStorage on server to prevent hydration mismatch
    if (!hasMounted) {
      return "browse";
    }

    return isValidLastPlaygroundPath(getLastPlaygroundPath())
      ? "code"
      : "browse";
  }, [view, hasProjectSlug, hasMounted]);

  const previousView = usePrevious(currentView);

  // With a project slug, default UI is Code; mirror that in the URL when `view` is omitted
  // (e.g. "Try it out", shared links, or `/playground/foo` without query).
  useEffect(() => {
    if (!router.isReady) return;
    if (!hasProjectSlug) return;
    if (view !== "") return;

    setView("code", { replace: true });
  }, [router.isReady, hasProjectSlug, view, setView, router]);

  const navigateTo = useCallback(
    (targetView: PlaygroundView, pathName?: string) => {
      setView(targetView, { replace: true, pathName });
    },
    [setView],
  );

  const goToBrowse = useCallback(() => navigateTo("browse"), [navigateTo]);
  const goToCode = useCallback(
    (projectSlug?: string) => {
      const pathName = projectSlug ? `/playground/${projectSlug}` : undefined;

      if (projectSlug) {
        dispatch(projectSlice.actions.loadStart());
      }
      navigateTo("code", pathName);
    },
    [dispatch, navigateTo],
  );
  const goToResults = useCallback(() => navigateTo("results"), [navigateTo]);

  // Stop callstack playback when user leaves results view on mobile (e.g. Back button).
  useEffect(() => {
    if (previousView === "results" && currentView !== "results") {
      dispatch(callstackSlice.actions.setIsPlaying(false));
    }
  }, [currentView, previousView, dispatch]);

  return {
    currentView,
    hasProjectSlug,
    goToBrowse,
    goToCode,
    goToResults,
  } as const;
};
