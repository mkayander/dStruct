import { Close } from "@mui/icons-material";
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
import React, { useEffect, useMemo, useRef } from "react";

import type { RouterOutputs } from "#/shared/api";
import { useI18nContext, usePlaygroundSlugs } from "#/shared/hooks";
import { api } from "#/shared/lib";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

import {
  projectBrowserSlice,
  selectCurrentPage,
  selectIsOpen,
  selectPageSize,
  selectSearchQuery,
  selectSelectedCategories,
  selectSelectedDifficulties,
  selectShowOnlyNew,
  selectSortBy,
  selectSortOrder,
} from "../../model/projectBrowserSlice";
import { ProjectBrowserCategoryBar } from "./ProjectBrowserCategoryBar";
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
  const isOpen = useAppSelector(selectIsOpen);
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedCategories = useAppSelector(selectSelectedCategories);
  const selectedDifficulties = useAppSelector(selectSelectedDifficulties);
  const showOnlyNew = useAppSelector(selectShowOnlyNew);
  const sortBy = useAppSelector(selectSortBy);
  const sortOrder = useAppSelector(selectSortOrder);
  const currentPage = useAppSelector(selectCurrentPage);
  const pageSize = useAppSelector(selectPageSize);
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

  // Accumulate projects across pages
  type ProjectBrief =
    RouterOutputs["project"]["browseProjects"]["projects"][number];
  const accumulatedProjectsRef = useRef<ProjectBrief[]>([]);
  const lastQueryKeyRef = useRef<string>("");

  // Reset accumulated projects when filters/sort change
  useEffect(() => {
    if (queryKey !== lastQueryKeyRef.current) {
      accumulatedProjectsRef.current = [];
      lastQueryKeyRef.current = queryKey;
      // Reset to page 1 when filters change
      if (currentPage !== 1) {
        dispatch(projectBrowserSlice.actions.setCurrentPage(1));
      }
    }
  }, [queryKey, currentPage, dispatch]);

  // Accumulate projects when new page loads
  const accumulatedProjects = useMemo(() => {
    if (!browseProjects.data?.projects) {
      return accumulatedProjectsRef.current;
    }

    // If this is page 1, replace all projects
    if (currentPage === 1) {
      accumulatedProjectsRef.current = browseProjects.data.projects;
      return browseProjects.data.projects;
    }

    // Otherwise, append new projects (avoid duplicates)
    const existingIds = new Set(
      accumulatedProjectsRef.current.map((p: ProjectBrief) => p.id),
    );
    const newProjects = browseProjects.data.projects.filter(
      (p: ProjectBrief) => !existingIds.has(p.id),
    );
    accumulatedProjectsRef.current = [
      ...accumulatedProjectsRef.current,
      ...newProjects,
    ];
    return accumulatedProjectsRef.current;
  }, [browseProjects.data?.projects, currentPage]);

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
    dispatch(projectBrowserSlice.actions.setSearchQuery(value));
  };

  const handleSelectProject = (slug: string) => {
    void setProject(slug);
    dispatch(projectBrowserSlice.actions.setIsOpen(false));
    onSelectProject?.(slug);
  };

  const handleClose = () => {
    dispatch(projectBrowserSlice.actions.setIsOpen(false));
  };

  const handleRetry = () => {
    // Refetch queries to retry
    void allBrief.refetch();
    void browseProjects.refetch();
  };

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
            aria-label="Retry"
          >
            {(LL as { RETRY?: () => string }).RETRY?.() ?? "Retry"}
          </IconButton>
        ),
        persist: false,
        autoHideDuration: 6000,
      });
    }
  }, [error, enqueueSnackbar, closeSnackbar, handleRetry]);

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
  }, [isOpen]);

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={handleClose}
      aria-label="Project browser"
      slotProps={{
        paper: {
          sx: {
            width: "800px",
            maxWidth: "90vw",
            minWidth: 300, // Minimum width for usability
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
