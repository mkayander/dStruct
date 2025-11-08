import { Box, CircularProgress } from "@mui/material";
import React from "react";
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
  hasMore: boolean;
  total: number;
  selectedProjectSlug?: string;
  onSelectProject: (slug: string) => void;
};

// Estimated item height for virtualization (matches ProjectBrowserItem height)
const ITEM_HEIGHT = 72;

export const ProjectBrowserList: React.FC<ProjectBrowserListProps> = ({
  projects,
  isLoading,
  hasMore,
  total,
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
  const handleEndReached = () => {
    if (hasMoreData && !isLoading) {
      dispatch(projectBrowserSlice.actions.setCurrentPage(currentPage + 1));
    }
  };

  if (isLoading) {
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
        itemContent={(index, project) => (
          <Box
            component="li"
            key={project.id}
            sx={{
              listStyle: "none",
            }}
          >
            <ProjectBrowserItem
              project={project}
              isSelected={project.slug === selectedProjectSlug}
              onClick={() => onSelectProject(project.slug)}
            />
          </Box>
        )}
        endReached={handleEndReached}
        overscan={5}
        fixedItemHeight={ITEM_HEIGHT}
        style={{ height: "100%", width: "100%" }}
        components={{
          List: React.forwardRef<HTMLDivElement>((props, ref) => (
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
            />
          )),
          Footer: () =>
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
        }}
      />
    </Box>
  );
};
