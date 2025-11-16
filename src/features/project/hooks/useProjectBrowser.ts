import { useEffect } from "react";

import { api } from "#/shared/lib";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

import {
  projectBrowserSlice,
  selectIsLoading,
} from "../model/projectBrowserSlice";
import { useProjectBrowserContext } from "../ui/ProjectBrowser/ProjectBrowserContext";

/**
 * @deprecated This hook is deprecated. Use `useProjectBrowserContext` instead for URL-driven state
 * and Redux selectors directly for pagination state.
 * Main hook for ProjectBrowser functionality
 */
export const useProjectBrowser = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const context = useProjectBrowserContext();

  const allBrief = api.project.allBrief.useQuery();

  useEffect(() => {
    dispatch(projectBrowserSlice.actions.setIsLoading(allBrief.isLoading));
  }, [allBrief.isLoading, dispatch]);

  return {
    ...context,
    isLoading,
    projects: allBrief.data,
    openBrowser: context.openBrowser,
    closeBrowser: context.closeBrowser,
  };
};
