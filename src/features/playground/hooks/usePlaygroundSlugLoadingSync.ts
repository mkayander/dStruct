"use client";

import { useEffect, useRef } from "react";

import { projectSlice } from "#/features/project/model/projectSlice";
import { usePlaygroundRoute } from "#/shared/hooks/usePlaygroundRoute";
import { useAppDispatch } from "#/store/hooks";

/**
 * Reset the panel loading gate when playground URL segments change
 * (back/forward, <Link>, or programmatic navigations — not only setProject).
 */
export const usePlaygroundSlugLoadingSync = (): void => {
  const dispatch = useAppDispatch();
  const route = usePlaygroundRoute();
  const slugKey = route?.slug.join("/") ?? "";
  const previousSlugKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!route) {
      return;
    }

    if (previousSlugKeyRef.current === slugKey) {
      return;
    }

    previousSlugKeyRef.current = slugKey;
    dispatch(projectSlice.actions.loadStart());
  }, [dispatch, route, slugKey]);
};
