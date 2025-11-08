import { Box, CircularProgress } from "@mui/material";
import React, { useCallback, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";

import type { RouterOutputs } from "#/shared/api";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

import {
  projectBrowserSlice,
  selectCurrentPage,
  selectHasMore,
  selectSearchQuery,
  selectSelectedCategories,
  selectSelectedDifficulties,
  selectShowOnlyNew,
} from "../../model/projectBrowserSlice";
import { ProjectBrowserEmpty } from "./ProjectBrowserEmpty";
import { ProjectBrowserItem } from "./ProjectBrowserItem";

type ProjectBrief =
  RouterOutputs["project"]["browseProjects"]["projects"][number];

type ProjectBrowserListProps = {
  projects: ProjectBrief[] | undefined;
  isLoading: boolean;
  selectedProjectSlug?: string;
  onSelectProject: (slug: string) => void;
};

// Fixed item height for virtualization - matches actual rendered height
const ITEM_HEIGHT = 76;

// List component for Virtuoso
const VirtuosoList: React.FC<{
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}> = ({ children, ref, ...props }) => (
  <Box
    component="ul"
    role="list"
    ref={ref}
    {...props}
    sx={{
      listStyle: "none",
      p: 0,
      m: 0,
    }}
  >
    {children}
  </Box>
);

export const ProjectBrowserList: React.FC<ProjectBrowserListProps> = ({
  projects,
  isLoading,
  selectedProjectSlug,
  onSelectProject,
}) => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedCategories = useAppSelector(selectSelectedCategories);
  const selectedDifficulties = useAppSelector(selectSelectedDifficulties);
  const showOnlyNew = useAppSelector(selectShowOnlyNew);
  const currentPage = useAppSelector(selectCurrentPage);
  const hasMoreData = useAppSelector(selectHasMore);

  // Projects are already filtered and sorted server-side
  const displayedProjects = projects ?? [];

  // Handle infinite scroll - load next page when reaching the end
  const handleEndReached = useCallback(() => {
    if (hasMoreData && !isLoading) {
      dispatch(projectBrowserSlice.actions.setCurrentPage(currentPage + 1));
    }
  }, [hasMoreData, isLoading, currentPage, dispatch]);

  // Memoize item renderer to prevent unnecessary re-renders
  // Use a stable callback map to prevent onClick recreation
  const itemContent = useCallback(
    (_index: number, project: ProjectBrief) => {
      const handleClick = () => onSelectProject(project.slug);
      return (
        <Box
          component="li"
          sx={{
            listStyle: "none",
          }}
        >
          <ProjectBrowserItem
            project={project}
            isSelected={project.slug === selectedProjectSlug}
            onClick={handleClick}
          />
        </Box>
      );
    },
    [selectedProjectSlug, onSelectProject],
  );

  // Memoize Footer component to prevent recreation on every render
  const Footer = useMemo(
    () =>
      isLoading && hasMoreData ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      ) : null,
    [isLoading, hasMoreData],
  );

  const components = useMemo(
    () => ({
      List: VirtuosoList,
      Footer: () => Footer,
    }),
    [Footer],
  );

  // Only show full-page spinner on initial load (when no projects yet)
  // During pagination, show the list with footer loading indicator
  const isInitialLoad = isLoading && displayedProjects.length === 0;

  if (isInitialLoad) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isLoading && displayedProjects.length === 0) {
    const hasFilters =
      searchQuery.trim().length > 0 ||
      selectedCategories.length > 0 ||
      selectedDifficulties.length > 0 ||
      showOnlyNew;
    return (
      <ProjectBrowserEmpty searchQuery={searchQuery} hasFilters={hasFilters} />
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Virtuoso
        data={displayedProjects}
        totalCount={displayedProjects.length}
        itemContent={itemContent}
        endReached={handleEndReached}
        fixedItemHeight={ITEM_HEIGHT}
        style={{ height: "100%", width: "100%" }}
        components={components}
      />
    </Box>
  );
};
