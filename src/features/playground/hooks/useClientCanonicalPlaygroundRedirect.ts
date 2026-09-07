"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { usePlaygroundInitialData } from "#/features/playground/context/PlaygroundInitialDataContext";
import { usePlaygroundMobileLayout } from "#/features/playground/hooks/usePlaygroundMobileLayout";
import { api } from "#/shared/api";
import { useHasMounted } from "#/shared/hooks";
import { usePlaygroundRoute } from "#/shared/hooks/usePlaygroundRoute";
import { appendPlaygroundMobileViewQuery } from "#/shared/lib/appendPlaygroundMobileViewQuery";
import {
  buildCanonicalPlaygroundSlug,
  playgroundSlugKey,
} from "#/shared/lib/buildCanonicalPlaygroundSlug";
import { getRestorablePlaygroundPath } from "#/shared/lib/playgroundLastPath";
import { buildPlaygroundPath } from "#/shared/lib/playgroundRoute";
import { getLastPlaygroundPath } from "#/shared/local-storage/playgroundPath";

/**
 * Mirrors server canonical redirects for client navigations (instant nav, <Link>).
 * Server `redirect()` does not always update the browser URL during soft navigations.
 */
export const useClientCanonicalPlaygroundRedirect = (): void => {
  const route = usePlaygroundRoute();
  const searchParams = useSearchParams();
  const isMobile = usePlaygroundMobileLayout();
  const serverInitialData = usePlaygroundInitialData();
  const hasMounted = useHasMounted();
  const redirectingRef = useRef(false);

  const routeProjectSlug = route?.slug[0] ?? "";
  const viewParam = searchParams?.get("view") ?? null;
  const routePath = route?.pathname ?? "";

  const allBriefQuery = api.project.allBrief.useQuery(undefined, {
    initialData: serverInitialData?.allBrief,
    enabled: Boolean(route && !routeProjectSlug && viewParam !== "browse"),
  });

  const projectQuery = api.project.getBySlug.useQuery(routeProjectSlug, {
    enabled: Boolean(route && routeProjectSlug),
    initialData:
      serverInitialData?.projectBySlug?.slug === routeProjectSlug
        ? serverInitialData.projectBySlug
        : undefined,
  });

  useEffect(() => {
    redirectingRef.current = false;
  }, [routePath]);

  // Bare `/playground`: restore last visit or first public project (mirror server redirect).
  useEffect(() => {
    if (
      !route ||
      routeProjectSlug ||
      viewParam === "browse" ||
      redirectingRef.current ||
      !hasMounted
    ) {
      return;
    }

    const restoredPath = getRestorablePlaygroundPath(
      getLastPlaygroundPath(),
      route.basePath,
    );
    if (restoredPath) {
      const restoredTarget = appendPlaygroundMobileViewQuery(restoredPath, {
        isMobile,
        hasViewParam: Boolean(viewParam),
        hasCanonicalSlug: true,
      });
      if (restoredTarget !== routePath) {
        redirectingRef.current = true;
        route.navigateTo(restoredTarget, { replace: true });
      }
      return;
    }

    const firstProjectSlug = allBriefQuery.data?.[0]?.slug;
    if (!firstProjectSlug) {
      return;
    }

    redirectingRef.current = true;
    const targetPath = buildPlaygroundPath(route.basePath, [firstProjectSlug]);
    const pathWithMobileView = appendPlaygroundMobileViewQuery(targetPath, {
      isMobile,
      hasViewParam: Boolean(viewParam),
      hasCanonicalSlug: true,
    });
    route.navigateTo(pathWithMobileView, { replace: true });
  }, [
    allBriefQuery.data,
    hasMounted,
    isMobile,
    route,
    routePath,
    routeProjectSlug,
    viewParam,
  ]);

  useEffect(() => {
    if (
      !route ||
      !routeProjectSlug ||
      !projectQuery.data ||
      redirectingRef.current
    ) {
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
    const canonicalPath = buildPlaygroundPath(route.basePath, canonicalSlug);
    const targetPath = appendPlaygroundMobileViewQuery(canonicalPath, {
      isMobile,
      hasViewParam: Boolean(viewParam),
      hasCanonicalSlug: canonicalSlug.length > 0,
    });

    route.navigateTo(targetPath, {
      replace: true,
    });
  }, [
    isMobile,
    projectQuery.data,
    route,
    routeProjectSlug,
    routePath,
    viewParam,
  ]);
};
