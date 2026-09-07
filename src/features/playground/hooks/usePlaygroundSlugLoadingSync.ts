"use client";

import { useEffect, useRef } from "react";

import { usePlaygroundInitialData } from "#/features/playground/context/PlaygroundInitialDataContext";
import { serverPrefetchMatchesRoute } from "#/features/playground/lib/serverPrefetchMatchesRoute";
import { projectSlice } from "#/features/project/model/projectSlice";
import { usePlaygroundRoute } from "#/shared/hooks/usePlaygroundRoute";
import { useAppDispatch } from "#/store/hooks";

/**
 * Reset the panel loading gate when playground URL segments change
 * (back/forward, <Link>, or programmatic navigations — not only setProject).
 * Skips the initial loadStart when the server already prefetched matching data.
 */
export const usePlaygroundSlugLoadingSync = (): void => {
  const dispatch = useAppDispatch();
  const route = usePlaygroundRoute();
  const serverInitialData = usePlaygroundInitialData();
  const slugKey = route?.slug.join("/") ?? "";
  const previousSlugKeyRef = useRef<string | null>(null);
  const isFirstSlugEffectRef = useRef(true);

  useEffect(() => {
    if (!route) {
      return;
    }

    if (previousSlugKeyRef.current === slugKey) {
      return;
    }

    const skipInitialLoadStart =
      isFirstSlugEffectRef.current &&
      serverPrefetchMatchesRoute(serverInitialData, route.slug);

    previousSlugKeyRef.current = slugKey;
    isFirstSlugEffectRef.current = false;

    if (skipInitialLoadStart) {
      return;
    }

    dispatch(projectSlice.actions.loadStart());
  }, [dispatch, route, serverInitialData, slugKey]);
};
