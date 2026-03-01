"use client";

import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

const PLAYGROUND_VIEWS = ["browse", "code", "results"] as const;
export type PlaygroundView = (typeof PLAYGROUND_VIEWS)[number];

const isPlaygroundView = (value: unknown): value is PlaygroundView =>
  typeof value === "string" &&
  PLAYGROUND_VIEWS.includes(value as PlaygroundView);

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
    if (hasProjectSlug) return "code";

    const lastPath =
      typeof window !== "undefined"
        ? localStorage.getItem("lastPlaygroundPath")
        : null;
    const hasLastProject =
      lastPath?.startsWith("/playground/") && Boolean(lastPath.split("/")[2]);

    return hasLastProject ? "code" : "browse";
  }, [router.query.view, hasProjectSlug]);

  const navigateTo = useCallback(
    (view: PlaygroundView) => {
      const { pathname, query } = router;
      const newQuery = { ...query };

      if (view === "code") {
        delete newQuery.view;
      } else {
        newQuery.view = view;
      }

      void router.push({ pathname, query: newQuery }, undefined, {
        shallow: true,
      });
    },
    [router],
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
