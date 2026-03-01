"use client";

import { Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

import {
  projectBrowserSlice,
  selectAccumulatedProjects,
  selectCurrentPage,
  selectLastQueryKey,
  selectPageSize,
} from "#/features/project/model/projectBrowserSlice";
import { projectSlice } from "#/features/project/model/projectSlice";
import { ProjectBrowserCategoryBar } from "#/features/project/ui/ProjectBrowser/ProjectBrowserCategoryBar";
import { useProjectBrowserContext } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { ProjectBrowserHeader } from "#/features/project/ui/ProjectBrowser/ProjectBrowserHeader";
import { ProjectBrowserList } from "#/features/project/ui/ProjectBrowser/ProjectBrowserList";
import { useI18nContext, usePlaygroundSlugs } from "#/shared/hooks";
import { api } from "#/shared/lib";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

export const MobileBrowseView: React.FC = () => {
  const { LL } = useI18nContext();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const {
    searchQuery,
    selectedCategories,
    selectedDifficulties,
    showOnlyNew,
    sortBy,
    sortOrder,
    setSearchQuery,
  } = useProjectBrowserContext();

  const router = useRouter();

  const currentPage = useAppSelector(selectCurrentPage);
  const pageSize = useAppSelector(selectPageSize);
  const accumulatedProjects = useAppSelector(selectAccumulatedProjects);
  const lastQueryKey = useAppSelector(selectLastQueryKey);
  const { projectSlug = "" } = usePlaygroundSlugs();

  const allBrief = api.project.allBrief.useQuery();

  const browseProjects = api.project.browseProjects.useQuery({
    page: currentPage,
    pageSize,
    search: searchQuery.trim() || undefined,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    difficulties:
      selectedDifficulties.length > 0 ? selectedDifficulties : undefined,
    showOnlyNew: showOnlyNew || undefined,
    showOnlyMine: false,
    sortBy: sortBy === "date" ? "createdAt" : sortBy,
    sortOrder,
  });

  const error = browseProjects.error || allBrief.error;

  const queryKey = useMemo(
    () =>
      JSON.stringify({
        pageSize,
        search: searchQuery.trim() || undefined,
        categories:
          selectedCategories.length > 0 ? selectedCategories : undefined,
        difficulties:
          selectedDifficulties.length > 0 ? selectedDifficulties : undefined,
        showOnlyNew: showOnlyNew || undefined,
        showOnlyMine: false,
        sortBy: sortBy === "date" ? "createdAt" : sortBy,
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

  useEffect(() => {
    if (queryKey !== lastQueryKey) {
      dispatch(projectBrowserSlice.actions.clearAccumulatedProjects());
      dispatch(projectBrowserSlice.actions.setLastQueryKey(queryKey));
      if (currentPage !== 1) {
        dispatch(projectBrowserSlice.actions.setCurrentPage(1));
      }
    }
  }, [queryKey, lastQueryKey, currentPage, dispatch]);

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

  const handleSelectProject = useCallback(
    (slug: string) => {
      dispatch(projectSlice.actions.loadStart());
      void router.push(`/playground/${slug}`);
    },
    [dispatch, router],
  );

  const handleRetry = useCallback(() => {
    void allBrief.refetch();
    void browseProjects.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBrief.refetch, browseProjects.refetch]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load projects";
      enqueueSnackbar(errorMessage, {
        variant: "error",
        action: () => (
          <IconButton
            size="small"
            onClick={() => {
              handleRetry();
            }}
            color="inherit"
            aria-label={LL.RETRY()}
          >
            {LL.RETRY()}
          </IconButton>
        ),
        autoHideDuration: 6000,
        key: "mobile-browse-error",
      });
    }
  }, [error, enqueueSnackbar, handleRetry, LL]);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Stack sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          {LL.PROJECT_BROWSER()}
        </Typography>
      </Box>
      <Divider />

      <ProjectBrowserCategoryBar projects={allBrief.data} />
      <ProjectBrowserHeader
        searchValue={searchQuery}
        onSearchChange={(value) => setSearchQuery(value)}
        searchInputRef={searchInputRef}
      />
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <ProjectBrowserList
          projects={accumulatedProjects}
          isLoading={browseProjects.isLoading}
          selectedProjectSlug={projectSlug}
          onSelectProject={handleSelectProject}
        />
      </Box>
    </Stack>
  );
};
