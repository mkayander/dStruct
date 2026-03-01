import { Box } from "@mui/material";
import React, { useRef } from "react";

import { usePlaygroundSlugs } from "#/shared/hooks";
import { useAppSelector } from "#/store/hooks";

import { useBrowseProjects } from "../../hooks/useBrowseProjects";
import { selectAccumulatedProjects } from "../../model/projectBrowserSlice";
import { ProjectBrowserCategoryBar } from "./ProjectBrowserCategoryBar";
import { useProjectBrowserContext } from "./ProjectBrowserContext";
import { ProjectBrowserHeader } from "./ProjectBrowserHeader";
import { ProjectBrowserList } from "./ProjectBrowserList";

type ProjectBrowserContentProps = {
  onSelectProject: (slug: string) => void;
  /** Optional ref for search input (e.g. for keyboard focus from parent) */
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
};

/**
 * Shared browse content: category bar, search/filters header, and project list.
 * Used by both ProjectBrowser (drawer) and MobileBrowseView.
 */
export const ProjectBrowserContent: React.FC<ProjectBrowserContentProps> = ({
  onSelectProject,
  searchInputRef: searchInputRefProp,
}) => {
  const { searchQuery, setSearchQuery } = useProjectBrowserContext();
  const { allBrief, browseProjects } = useBrowseProjects();
  const accumulatedProjects = useAppSelector(selectAccumulatedProjects);
  const { projectSlug = "" } = usePlaygroundSlugs();
  const internalSearchRef = useRef<HTMLInputElement | null>(null);
  const searchInputRef = searchInputRefProp ?? internalSearchRef;

  return (
    <>
      <ProjectBrowserCategoryBar projects={allBrief.data} />
      <ProjectBrowserHeader
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchInputRef={searchInputRef}
      />
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <ProjectBrowserList
          projects={accumulatedProjects}
          isLoading={browseProjects.isLoading}
          selectedProjectSlug={projectSlug}
          onSelectProject={onSelectProject}
        />
      </Box>
    </>
  );
};
