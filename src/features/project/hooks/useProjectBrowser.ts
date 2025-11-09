import { useEffect } from "react";

import { api } from "#/shared/lib";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

import {
  projectBrowserSlice,
  selectBrowserState,
  selectIsLoading,
} from "../model/projectBrowserSlice";

/**
 * Main hook for ProjectBrowser functionality
 */
export const useProjectBrowser = () => {
  const dispatch = useAppDispatch();
  const browserState = useAppSelector(selectBrowserState);
  const isLoading = useAppSelector(selectIsLoading);

  const allBrief = api.project.allBrief.useQuery();

  useEffect(() => {
    dispatch(projectBrowserSlice.actions.setIsLoading(allBrief.isLoading));
  }, [allBrief.isLoading, dispatch]);

  const openBrowser = () => {
    dispatch(projectBrowserSlice.actions.setIsOpen(true));
  };

  const closeBrowser = () => {
    dispatch(projectBrowserSlice.actions.setIsOpen(false));
  };

  return {
    ...browserState,
    isLoading,
    projects: allBrief.data,
    openBrowser,
    closeBrowser,
  };
};
