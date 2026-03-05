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

/** Pairs of views that should use replace (not push) to avoid history stack growth. */
const REPLACE_TRANSITION_PAIRS: ReadonlyArray<
  [PlaygroundView, PlaygroundView]
> = [["code", "results"]];

const isReplaceTransition = (
  from: PlaygroundView,
  to: PlaygroundView,
): boolean =>
  REPLACE_TRANSITION_PAIRS.some(
    ([a, b]) => (from === a && to === b) || (from === b && to === a),
  );

/**
 * Manages the mobile playground phase via the `?view=` query parameter.
 * Uses `router.push` for transitions so browser back/forward work naturally.
 * Defaults to "browse" when no project is selected, "code" otherwise.
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

  const navigateTo = useCallback(
    (view: PlaygroundView, pathName?: string) => {
      const replace = isReplaceTransition(currentView, view);
      setView(view, { replace, pathName });
    },
    [setView, currentView],
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

  const prevView = usePrevious(currentView);
  // Stop callstack playback when user leaves results view on mobile (e.g. Back button).
  useEffect(() => {
    if (prevView === "results" && currentView !== "results") {
      dispatch(callstackSlice.actions.setIsPlaying(false));
    }
  }, [currentView, prevView, dispatch]);

  return {
    currentView,
    hasProjectSlug,
    goToBrowse,
    goToCode,
    goToResults,
  } as const;
};
