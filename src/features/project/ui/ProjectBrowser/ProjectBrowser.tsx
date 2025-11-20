import Close from "@mui/icons-material/Close";
import {
  alpha,
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

import {
  useI18nContext,
  useMobileLayout,
  usePlaygroundSlugs,
} from "#/shared/hooks";
import { api } from "#/shared/lib";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

import {
  projectBrowserSlice,
  selectAccumulatedProjects,
  selectCurrentPage,
  selectLastQueryKey,
  selectPageSize,
} from "../../model/projectBrowserSlice";
import { ProjectBrowserCategoryBar } from "./ProjectBrowserCategoryBar";
import { useProjectBrowserContext } from "./ProjectBrowserContext";
import { ProjectBrowserHeader } from "./ProjectBrowserHeader";
import { ProjectBrowserList } from "./ProjectBrowserList";

type ProjectBrowserProps = {
  onSelectProject?: (projectSlug: string) => void;
};

export const ProjectBrowser: React.FC<ProjectBrowserProps> = ({
  onSelectProject,
}) => {
  const { LL } = useI18nContext();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const isMobile = useMobileLayout();

  // Get all filter state from context (URL-based, no Redux sync needed)
  const {
    isOpen,
    closeBrowser,
    searchQuery,
    selectedCategories,
    selectedDifficulties,
    showOnlyNew,
    sortBy,
    sortOrder,
    setSearchQuery,
  } = useProjectBrowserContext();

  // Redux state - only for derived/computed state (pagination, accumulated projects)
  const currentPage = useAppSelector(selectCurrentPage);
  const pageSize = useAppSelector(selectPageSize);
  const accumulatedProjects = useAppSelector(selectAccumulatedProjects);
  const lastQueryKey = useAppSelector(selectLastQueryKey);
  const { projectSlug = "", setProject } = usePlaygroundSlugs();

  // Get all projects for category counts (category bar needs all projects)
  const allBrief = api.project.allBrief.useQuery();

  // Get paginated, filtered, and sorted projects
  const browseProjects = api.project.browseProjects.useQuery({
    page: currentPage,
    pageSize,
    search: searchQuery.trim() || undefined,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    difficulties:
      selectedDifficulties.length > 0 ? selectedDifficulties : undefined,
    showOnlyNew: showOnlyNew || undefined,
    showOnlyMine: false, // Placeholder for future
    sortBy: sortBy === "date" ? "createdAt" : sortBy,
    sortOrder,
  });

  // Get errors directly from TRPC queries
  const error = browseProjects.error || allBrief.error;

  // Create a query key based on filters/sort (excluding page for accumulation)
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

  // Reset accumulated projects when filters/sort change
  useEffect(() => {
    if (queryKey !== lastQueryKey) {
      dispatch(projectBrowserSlice.actions.clearAccumulatedProjects());
      dispatch(projectBrowserSlice.actions.setLastQueryKey(queryKey));
      // Reset to page 1 when filters change
      if (currentPage !== 1) {
        dispatch(projectBrowserSlice.actions.setCurrentPage(1));
      }
    }
  }, [queryKey, lastQueryKey, currentPage, dispatch]);

  // Accumulate projects when new page loads
  useEffect(() => {
    if (!browseProjects.data?.projects) {
      return;
    }

    // If this is page 1, replace all projects
    if (currentPage === 1) {
      dispatch(
        projectBrowserSlice.actions.setAccumulatedProjects(
          browseProjects.data.projects,
        ),
      );
      return;
    }

    // Otherwise, append new projects
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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSelectProject = (slug: string) => {
    void setProject(slug);
    closeBrowser();
    onSelectProject?.(slug);
  };

  const handleClose = useCallback(() => {
    closeBrowser();
  }, [closeBrowser]);

  const handleRetry = useCallback(() => {
    // Refetch queries to retry
    void allBrief.refetch();
    void browseProjects.refetch();
  }, [allBrief.refetch, browseProjects.refetch]);

  // Show error snackbar when error occurs
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
        key: "project-browser-error", // Prevent duplicate snackbars
      });
    }
  }, [error, enqueueSnackbar, closeSnackbar, handleRetry, LL]);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard navigation: Escape to close, Ctrl/Cmd+F to focus search
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (ev: KeyboardEvent) => {
      // Escape to close browser
      if (ev.key === "Escape") {
        ev.preventDefault();
        handleClose();
        return;
      }

      // Ctrl/Cmd + F to focus search
      if ((ev.ctrlKey || ev.metaKey) && ev.key === "f") {
        ev.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  const drawerLayout = isMobile
    ? {
        width: "100%",
      }
    : {
        width: "800px",
        maxWidth: "90vw",
        minWidth: 300, // Minimum width for usability
      };

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={handleClose}
      aria-label="Project browser"
      slotProps={{
        paper: {
          sx: {
            ...drawerLayout,
            background: alpha(theme.palette.background.paper, 0.68),
            backdropFilter: "blur(18px)",
          },
        },
      }}
      ModalProps={{
        keepMounted: false, // Better performance on mobile
      }}
    >
      <Stack
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            p: 2,
            pb: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {LL.PROJECT_BROWSER()}
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            aria-label="Close project browser"
          >
            <Close />
          </IconButton>
        </Box>
        <Divider />

        <ProjectBrowserCategoryBar projects={allBrief.data} />
        <ProjectBrowserHeader
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
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
    </Drawer>
  );
};
