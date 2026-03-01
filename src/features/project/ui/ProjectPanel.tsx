import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import FolderOpen from "@mui/icons-material/FolderOpen";
import { TabContext, TabList } from "@mui/lab";
import { IconButton, Stack, Tab, Tooltip } from "@mui/material";
import Head from "next/head";
import React, { useState } from "react";

import { ArgsEditor } from "#/features/argsEditor/ui/ArgsEditor";
import { useProjectPanelData } from "#/features/project/hooks/useProjectPanelData";
import { useProjectBrowserContext } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { TestCaseSelectBar } from "#/features/project/ui/TestCaseSelectBar";
import { useI18nContext } from "#/shared/hooks";
import { LoadingSkeletonOverlay } from "#/shared/ui/atoms/LoadingSkeletonOverlay";
import { PanelWrapper } from "#/shared/ui/templates/PanelWrapper";
import { StyledTabPanel } from "#/shared/ui/templates/StyledTabPanel";
import { TabListWrapper } from "#/shared/ui/templates/TabListWrapper";

import { ProjectInfo } from "./ProjectInfo";
import { ProjectModal } from "./ProjectModal";

export const ProjectPanel: React.FC = () => {
  const { LL } = useI18nContext();

  const { session, isEditable, selectedProject, selectedCase } =
    useProjectPanelData();

  const { openBrowser } = useProjectBrowserContext();

  const [tabValue, setTabValue] = useState("1");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isModalEditMode, setIsModalEditMode] = useState(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleCreateProject = () => {
    setIsModalEditMode(false);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = () => {
    setIsModalEditMode(true);
    setIsProjectModalOpen(true);
  };

  return (
    <PanelWrapper>
      <Head>
        <title>
          {selectedProject.data
            ? `${selectedProject.data?.title} - dStruct Playground`
            : "dStruct Playground"}
        </title>
      </Head>
      <ProjectModal
        open={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        isEditMode={isModalEditMode}
        currentProject={selectedProject.data}
      />

      <LoadingSkeletonOverlay />

      <TabContext value={tabValue}>
        <TabListWrapper>
          <TabList onChange={handleTabChange} aria-label={LL.PANEL_TABS()}>
            <Tab label={LL.PROJECT()} value="1" />
          </TabList>
          <Stack direction="row" spacing={1} alignItems="center" pr={1}>
            <Tooltip title={`${LL.PROJECT_BROWSER()} 📁`} arrow>
              <IconButton onClick={openBrowser}>
                <FolderOpen />
              </IconButton>
            </Tooltip>
            {isEditable && (
              <Tooltip title={`${LL.EDIT_SELECTED_PROJECT()} ✍`} arrow>
                <IconButton onClick={handleEditProject}>
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            {session.data && (
              <Tooltip title={`${LL.CREATE_NEW_PROJECT()} ➕`} arrow>
                <IconButton onClick={handleCreateProject}>
                  <Add />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </TabListWrapper>

        <StyledTabPanel
          value="1"
          sx={{ display: "flex", flexFlow: "column nowrap", p: 2, gap: 1 }}
        >
          <ProjectInfo project={selectedProject.data} />

          <TestCaseSelectBar selectedProject={selectedProject} />

          <ArgsEditor selectedCase={selectedCase} />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
