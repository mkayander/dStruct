"use client";

import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import {
  projectSlice,
  selectIsEditable,
} from "#/features/project/model/projectSlice";
import { usePlaygroundSlugs } from "#/shared/hooks";
import { usePagesRouterCompat } from "#/shared/hooks/usePagesRouterCompat";
import { usePlaygroundRoute } from "#/shared/hooks/usePlaygroundRoute";
import { api } from "#/shared/lib";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

/**
 * Encapsulates the project/case data fetching and side effects
 * shared between `ProjectPanel` (desktop) and `MobileCodeView` (mobile).
 */
export const useProjectPanelData = () => {
  const session = useSession();
  const dispatch = useAppDispatch();
  const pagesRouter = usePagesRouterCompat();
  const playgroundRoute = usePlaygroundRoute();

  const isRouteReady = pagesRouter
    ? pagesRouter.isReady
    : playgroundRoute !== null;

  const {
    projectSlug = "",
    caseSlug = "",
    setProject,
    clearSlugs,
  } = usePlaygroundSlugs();

  const allBrief = api.project.allBrief.useQuery();
  const isEditable = useAppSelector(selectIsEditable);

  const selectedProject = api.project.getBySlug.useQuery(projectSlug, {
    enabled: Boolean(projectSlug),
    retry(failureCount, error) {
      if (error instanceof TRPCClientError && error.data.code === "NOT_FOUND") {
        return false;
      }
      return failureCount < 4;
    },
  });

  useEffect(() => {
    if (selectedProject.data) {
      dispatch(projectSlice.actions.changeProjectId(selectedProject.data.id));
    }
  }, [selectedProject.data, dispatch]);

  useEffect(() => {
    if (selectedProject.error) {
      dispatch(projectSlice.actions.loadFinish());
    }
  }, [selectedProject.error, dispatch]);

  const selectedCase = api.project.getCaseBySlug.useQuery(
    { projectId: selectedProject.data?.id || "", slug: caseSlug },
    { enabled: Boolean(selectedProject.data?.id && caseSlug) },
  );

  useEffect(() => {
    if (selectedProject.error) {
      console.error("selectedProject.error: ", selectedProject.error);
      clearSlugs();
      return;
    }
    if (!selectedProject.data || !session.data) {
      if (isEditable) {
        dispatch(projectSlice.actions.changeIsEditable(false));
      }
      return;
    }

    const user = session.data.user;
    const newState = user.isAdmin || selectedProject.data.userId === user.id;
    if (isEditable !== newState) {
      dispatch(projectSlice.actions.changeIsEditable(newState));
    }
  }, [
    clearSlugs,
    dispatch,
    isEditable,
    selectedProject.data,
    selectedProject.error,
    session.data,
  ]);

  // On landing with no slug, open the first public project once route + brief list are ready.
  useEffect(() => {
    if (allBrief.data?.length && isRouteReady && !projectSlug) {
      const firstProject = allBrief.data[0];
      if (firstProject) {
        setProject(firstProject.slug, true);
      }
    }
  }, [allBrief.data, isRouteReady, projectSlug, setProject]);

  return {
    session,
    isEditable,
    selectedProject,
    selectedCase,
    projectSlug,
    caseSlug,
  } as const;
};
