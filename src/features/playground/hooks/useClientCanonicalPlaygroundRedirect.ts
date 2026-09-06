"use client";

import { useEffect, useRef } from "react";

import { usePlaygroundInitialData } from "#/features/playground/context/PlaygroundInitialDataContext";
import { api } from "#/shared/api";
import { usePlaygroundRoute } from "#/shared/hooks/usePlaygroundRoute";
import {
  buildCanonicalPlaygroundSlug,
  playgroundSlugKey,
} from "#/shared/lib/buildCanonicalPlaygroundSlug";
import { buildPlaygroundPath } from "#/shared/lib/playgroundRoute";

/**
 * Mirrors server canonical redirects for client navigations (instant nav, <Link>).
 * Server `redirect()` does not always update the browser URL during soft navigations.
 */
export const useClientCanonicalPlaygroundRedirect = (): void => {
  const route = usePlaygroundRoute();
  const serverInitialData = usePlaygroundInitialData();
  const redirectingRef = useRef(false);

  const routeProjectSlug = route?.slug[0] ?? "";

  const projectQuery = api.project.getBySlug.useQuery(routeProjectSlug, {
    enabled: Boolean(route && routeProjectSlug),
    initialData:
      serverInitialData?.projectBySlug?.slug === routeProjectSlug
        ? serverInitialData.projectBySlug
        : undefined,
  });

  useEffect(() => {
    if (!route || !routeProjectSlug || !projectQuery.data || redirectingRef.current) {
      return;
    }

    const canonicalSlug = buildCanonicalPlaygroundSlug(
      projectQuery.data,
      route.slug[1],
      route.slug[2],
    );

    if (playgroundSlugKey(route.slug) === playgroundSlugKey(canonicalSlug)) {
      redirectingRef.current = false;
      return;
    }

    redirectingRef.current = true;
    route.navigateTo(buildPlaygroundPath(route.basePath, canonicalSlug), {
      replace: true,
    });
  }, [projectQuery.data, route]);
};
