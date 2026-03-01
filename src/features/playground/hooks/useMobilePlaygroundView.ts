"use client";

import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

const PLAYGROUND_VIEWS = ["browse", "code", "results"] as const;
export type PlaygroundView = (typeof PLAYGROUND_VIEWS)[number];

const isPlaygroundView = (value: unknown): value is PlaygroundView =>
  typeof value === "string" &&
  PLAYGROUND_VIEWS.includes(value as PlaygroundView);

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
 * Reads the `view` query param directly from the browser URL.
 * Used as an immediate fallback before Next.js router hydrates `router.query`.
 */
const getViewFromLocation = (): PlaygroundView | null => {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  return isPlaygroundView(view) ? view : null;
};

/**
 * Manages the mobile playground phase via the `?view=` query parameter.
 * Uses `router.push` for transitions so browser back/forward work naturally.
 * Defaults to "browse" when no project is selected, "code" otherwise.
 */
export const useMobilePlaygroundView = () => {
  const router = useRouter();

  const hasProjectSlug = useMemo(() => {
    const slugs = router.query.slug;
    return Array.isArray(slugs) && slugs.length > 0;
  }, [router.query.slug]);

  const currentView: PlaygroundView = useMemo(() => {
    const param = router.query.view;
    if (typeof param === "string" && isPlaygroundView(param)) {
      return param;
    }

    if (!router.isReady) {
      const locationView = getViewFromLocation();
      if (locationView) return locationView;
    }

    if (hasProjectSlug) return "code";

    const lastPath =
      typeof window !== "undefined"
        ? localStorage.getItem("lastPlaygroundPath")
        : null;
    const hasLastProject =
      lastPath?.startsWith("/playground/") && Boolean(lastPath.split("/")[2]);

    return hasLastProject ? "code" : "browse";
  }, [router.query.view, router.isReady, hasProjectSlug]);

  const navigateTo = useCallback(
    (view: PlaygroundView) => {
      const { pathname, query } = router;
      const newQuery = { ...query };

      if (view === "code") {
        delete newQuery.view;
      } else {
        newQuery.view = view;
      }

      const route = { pathname, query: newQuery };
      const opts = { shallow: true };

      if (isReplaceTransition(currentView, view)) {
        void router.replace(route, undefined, opts);
      } else {
        void router.push(route, undefined, opts);
      }
    },
    [router, currentView],
  );

  const goToBrowse = useCallback(() => navigateTo("browse"), [navigateTo]);
  const goToCode = useCallback(() => navigateTo("code"), [navigateTo]);
  const goToResults = useCallback(() => navigateTo("results"), [navigateTo]);

  return {
    currentView,
    hasProjectSlug,
    goToBrowse,
    goToCode,
    goToResults,
  } as const;
};
