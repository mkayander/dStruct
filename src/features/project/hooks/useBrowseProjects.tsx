import { IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo } from "react";

import {
  getBrowseProjectsQueryKey,
  getBrowseProjectsQueryParams,
} from "#/features/project/lib/browseProjectsQuery";
import {
  projectBrowserSlice,
  selectCurrentPage,
  selectLastQueryKey,
  selectPageSize,
} from "#/features/project/model/projectBrowserSlice";
import { useProjectBrowserContext } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { useI18nContext } from "#/shared/hooks";
import { api } from "#/shared/lib";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

const BROWSE_PROJECTS_ERROR_KEY = "browse-projects-error";

/**
 * Hook for browsing projects with filters, sort, and pagination.
 * Encapsulates the browseProjects query, query key logic, Redux sync, and error snackbar.
 * Must be used within ProjectBrowserProvider.
 */
export const useBrowseProjects = () => {
  const dispatch = useAppDispatch();
  const {
    searchQuery,
    selectedCategories,
    selectedDifficulties,
    showOnlyNew,
    sortBy,
    sortOrder,
  } = useProjectBrowserContext();

  const currentPage = useAppSelector(selectCurrentPage);
  const pageSize = useAppSelector(selectPageSize);
  const lastQueryKey = useAppSelector(selectLastQueryKey);

  const filterParams = useMemo(
    () => ({
      pageSize,
      searchQuery,
      selectedCategories,
      selectedDifficulties,
      showOnlyNew,
      sortBy,
      sortOrder,
    }),
    [
      pageSize,
      searchQuery,
      selectedCategories,
      selectedDifficulties,
      showOnlyNew,
      sortBy,
      sortOrder,
    ],
  );

  const queryParams = useMemo(
    () => ({ ...filterParams, page: currentPage }),
    [filterParams, currentPage],
  );

  const queryKey = useMemo(
    () => getBrowseProjectsQueryKey(filterParams),
    [filterParams],
  );

  const allBrief = api.project.allBrief.useQuery();
  const browseProjects = api.project.browseProjects.useQuery(
    getBrowseProjectsQueryParams(queryParams),
  );

  const error = browseProjects.error ?? allBrief.error ?? null;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { LL } = useI18nContext();

  const handleRetry = useCallback(() => {
    void allBrief.refetch();
    void browseProjects.refetch();
  }, [allBrief, browseProjects]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load projects";
      enqueueSnackbar(errorMessage, {
        variant: "error",
        action: (key) => (
          <IconButton
            size="small"
            onClick={() => {
              handleRetry();
              closeSnackbar(key);
            }}
            color="inherit"
            aria-label={LL.RETRY()}
          >
            {LL.RETRY()}
          </IconButton>
        ),
        persist: false,
        autoHideDuration: 6000,
        key: BROWSE_PROJECTS_ERROR_KEY,
      });
    }
  }, [error, enqueueSnackbar, closeSnackbar, handleRetry, LL]);

  // Reset accumulated projects when filters/sort change
  useEffect(() => {
    if (queryKey !== lastQueryKey) {
      dispatch(projectBrowserSlice.actions.clearAccumulatedProjects());
      dispatch(projectBrowserSlice.actions.setLastQueryKey(queryKey));
      if (currentPage !== 1) {
        dispatch(projectBrowserSlice.actions.setCurrentPage(1));
      }
    }
  }, [queryKey, lastQueryKey, currentPage, dispatch]);

  // Accumulate projects when new page loads
  useEffect(() => {
    if (!browseProjects.data?.projects) return;

    if (currentPage === 1) {
      dispatch(
        projectBrowserSlice.actions.setAccumulatedProjects(
          browseProjects.data.projects,
        ),
      );
      return;
    }

    dispatch(
      projectBrowserSlice.actions.appendProjects(browseProjects.data.projects),
    );
  }, [browseProjects.data?.projects, currentPage, dispatch]);

  useEffect(() => {
    dispatch(
      projectBrowserSlice.actions.setIsLoading(
        allBrief.isLoading || browseProjects.isLoading,
      ),
    );
  }, [allBrief.isLoading, browseProjects.isLoading, dispatch]);

  useEffect(() => {
    if (browseProjects.data?.hasMore !== undefined) {
      dispatch(
        projectBrowserSlice.actions.setHasMore(browseProjects.data.hasMore),
      );
    }
  }, [browseProjects.data?.hasMore, dispatch]);

  return {
    isLoading: allBrief.isLoading || browseProjects.isLoading,
    allBrief,
    browseProjects,
    error,
    handleRetry,
  } as const;
};
