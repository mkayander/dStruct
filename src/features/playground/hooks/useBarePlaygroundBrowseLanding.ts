"use client";

import { useEffect, useRef } from "react";

import { usePlaygroundMobileLayout } from "#/features/playground/hooks/usePlaygroundMobileLayout";
import { useOptionalProjectBrowserContext } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { usePlaygroundRoute } from "#/shared/hooks/usePlaygroundRoute";

/**
 * Desktop bare `/playground` is an indexable landing — open the project browser
 * so users are not stuck on an empty split layout.
 */
export const useBarePlaygroundBrowseLanding = (): void => {
  const isMobile = usePlaygroundMobileLayout();
  const route = usePlaygroundRoute();
  const projectBrowser = useOptionalProjectBrowserContext();
  const openedForPathRef = useRef<string | null>(null);

  const routePath = route?.pathname ?? "";
  const projectSlug = route?.slug[0] ?? "";

  useEffect(() => {
    openedForPathRef.current = null;
  }, [routePath]);

  useEffect(() => {
    if (!route || isMobile || projectSlug || !projectBrowser) {
      return;
    }

    if (openedForPathRef.current === routePath) {
      return;
    }

    openedForPathRef.current = routePath;
    projectBrowser.openBrowser();
  }, [isMobile, projectBrowser, projectSlug, route, routePath]);
};
