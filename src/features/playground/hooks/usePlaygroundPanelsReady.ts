"use client";

import { useEffect, useMemo, useState } from "react";

import { usePlaygroundMobileLayout } from "#/features/playground/hooks/usePlaygroundMobileLayout";
import { selectIsInitialized } from "#/features/project/model/projectSlice";
import { usePlaygroundRoute } from "#/shared/hooks/usePlaygroundRoute";
import { useAppSelector } from "#/store/hooks";

/**
 * True when playground panel content can replace the route/panel skeleton
 * without a visible layout jump (split layout chunk loaded + project initialized).
 */
export const usePlaygroundPanelsReady = (): boolean => {
  const isMobile = usePlaygroundMobileLayout();
  const isInitialized = useAppSelector(selectIsInitialized);
  const route = usePlaygroundRoute();
  const projectSlug = route?.slug[0] ?? "";
  const [splitLayoutReady, setSplitLayoutReady] = useState(false);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    let cancelled = false;

    void import("#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayout").then(
      () => {
        if (!cancelled) {
          setSplitLayoutReady(true);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [isMobile]);

  return useMemo(() => {
    if (!route) {
      return false;
    }

    if (isMobile) {
      if (!projectSlug) {
        return true;
      }

      return isInitialized;
    }

    if (!splitLayoutReady || !projectSlug) {
      return false;
    }

    return isInitialized;
  }, [isInitialized, isMobile, projectSlug, route, splitLayoutReady]);
};
