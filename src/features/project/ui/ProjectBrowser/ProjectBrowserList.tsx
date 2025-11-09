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
import { ProjectBrowserItemSkeleton } from "./ProjectBrowserItemSkeleton";

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

  // Only show skeleton list on initial load (when no projects yet)
  // During pagination, show the list with footer loading indicator
  const isInitialLoad = isLoading && displayedProjects.length === 0;

  // Skeleton item renderer for initial load
  const skeletonItemContent = useCallback(
    (_index: number) => (
      <Box
        component="li"
        sx={{
          listStyle: "none",
        }}
      >
        <ProjectBrowserItemSkeleton />
      </Box>
    ),
    [],
  );

  if (isInitialLoad) {
    // Show skeleton list during initial load
    // Estimate ~10 items visible at once (adjust based on viewport)
    const skeletonCount = 10;
    return (
      <Box
        sx={{
          height: "100%",
          width: "100%",
        }}
        aria-live="polite"
        aria-busy={true}
      >
        <Virtuoso
          data={Array.from({ length: skeletonCount }, (_, i) => i)}
          totalCount={skeletonCount}
          itemContent={skeletonItemContent}
          fixedItemHeight={ITEM_HEIGHT}
          style={{ height: "100%", width: "100%" }}
          components={{
            List: VirtuosoList,
          }}
        />
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
      aria-live="polite"
      aria-busy={isLoading}
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
