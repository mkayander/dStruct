"use client";

import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { usePlaygroundInitialData } from "#/features/playground/context/PlaygroundInitialDataContext";
import {
  projectSlice,
  selectIsEditable,
} from "#/features/project/model/projectSlice";
import { usePlaygroundSlugs } from "#/shared/hooks";
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

  const { projectSlug = "", caseSlug = "", clearSlugs } = usePlaygroundSlugs();
  const route = usePlaygroundRoute();

  const serverInitialData = usePlaygroundInitialData();

  const isEditable = useAppSelector(selectIsEditable);

  const selectedProject = api.project.getBySlug.useQuery(projectSlug, {
    enabled: Boolean(projectSlug),
    initialData:
      serverInitialData?.projectBySlug?.slug === projectSlug
        ? serverInitialData.projectBySlug
        : undefined,
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
    {
      enabled: Boolean(selectedProject.data?.id && caseSlug),
      initialData:
        serverInitialData?.caseBySlug?.slug === caseSlug &&
        serverInitialData.projectBySlug?.id === selectedProject.data?.id
          ? serverInitialData.caseBySlug
          : undefined,
    },
  );

  useEffect(() => {
    if (selectedProject.error) {
      console.error("selectedProject.error: ", selectedProject.error);
      if (route) {
        route.navigateTo(route.basePath, { omitView: true });
      } else {
        clearSlugs();
      }
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
    route,
    selectedProject.data,
    selectedProject.error,
    session.data,
  ]);

  // Unblock the loading gate when case/solution selection cannot proceed.
  useEffect(() => {
    if (!selectedProject.data || selectedProject.isLoading) {
      return;
    }

    const { cases, solutions } = selectedProject.data;

    if (cases.length === 0) {
      dispatch(projectSlice.actions.loadFinish());
      return;
    }

    if (!caseSlug) {
      return;
    }

    if (solutions.length === 0) {
      dispatch(projectSlice.actions.loadFinish());
    }
  }, [caseSlug, dispatch, selectedProject.data, selectedProject.isLoading]);

  return {
    session,
    isEditable,
    selectedProject,
    selectedCase,
    projectSlug,
    caseSlug,
  } as const;
};
