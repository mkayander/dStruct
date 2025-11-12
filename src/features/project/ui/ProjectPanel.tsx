import { Add, Edit, FolderOpen } from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import { IconButton, Stack, Tab, Tooltip } from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { ArgsEditor } from "#/features/argsEditor/ui/ArgsEditor";
import { projectBrowserSlice } from "#/features/project/model/projectBrowserSlice";
import {
  projectSlice,
  selectIsEditable,
} from "#/features/project/model/projectSlice";
import { ProjectBrowser } from "#/features/project/ui/ProjectBrowser/ProjectBrowser";
import { TestCaseSelectBar } from "#/features/project/ui/TestCaseSelectBar";
import { usePlaygroundSlugs } from "#/shared/hooks";
import { useI18nContext } from "#/shared/hooks";
import { api } from "#/shared/lib";
import { LoadingSkeletonOverlay } from "#/shared/ui/atoms/LoadingSkeletonOverlay";
import { ProblemLinkButton } from "#/shared/ui/atoms/ProblemLinkButton";
import { PanelWrapper } from "#/shared/ui/templates/PanelWrapper";
import { StyledTabPanel } from "#/shared/ui/templates/StyledTabPanel";
import { TabListWrapper } from "#/shared/ui/templates/TabListWrapper";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

import { ProjectInfo } from "./ProjectInfo";
import { ProjectModal } from "./ProjectModal";

export const ProjectPanel: React.FC = () => {
  const session = useSession();
  const dispatch = useAppDispatch();

  const { LL } = useI18nContext();

  const router = useRouter();
  const {
    projectSlug = "",
    caseSlug = "",
    setProject,
    clearSlugs,
  } = usePlaygroundSlugs();

  const [tabValue, setTabValue] = useState("1");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isModalEditMode, setIsModalEditMode] = useState(false);

  const allBrief = api.project.allBrief.useQuery();

  const isEditable = useAppSelector(selectIsEditable);

  const handleOpenBrowser = () => {
    dispatch(projectBrowserSlice.actions.setIsOpen(true));
  };

  const selectedProject = api.project.getBySlug.useQuery(projectSlug, {
    enabled: Boolean(projectSlug),
    retry(failureCount, error) {
      if (error instanceof TRPCClientError && error.data.code === "NOT_FOUND") {
        return false;
      }

      return failureCount < 4;
    },
  });

  useEffect(() => {
    if (selectedProject.data) {
      dispatch(projectSlice.actions.changeProjectId(selectedProject.data.id));
    }
  }, [selectedProject.data, dispatch]);

  useEffect(() => {
    if (selectedProject.error) {
      dispatch(projectSlice.actions.loadFinish());
    }
  }, [selectedProject.error, dispatch]);

  const selectedCase = api.project.getCaseBySlug.useQuery(
    { projectId: selectedProject.data?.id || "", slug: caseSlug },
    { enabled: Boolean(selectedProject.data?.id && caseSlug) },
  );

  useEffect(() => {
    if (selectedProject.error) {
      console.log("selectedProject.error: ", selectedProject.error);
      clearSlugs();
      return;
    }
    if (!selectedProject.data || !session.data) {
      if (isEditable) {
        dispatch(projectSlice.actions.changeIsEditable(false));
      }
      return;
    }

    const user = session.data.user;

    const newState = user.isAdmin || selectedProject.data.userId === user.id;
    if (isEditable !== newState) {
      dispatch(projectSlice.actions.changeIsEditable(newState));
    }
  }, [
    clearSlugs,
    dispatch,
    isEditable,
    selectedProject.data,
    selectedProject.error,
    session.data,
  ]);

  useEffect(() => {
    if (allBrief.data?.length && router.isReady && !projectSlug) {
      const firstProject = allBrief.data[0];
      if (firstProject) {
        setProject(firstProject.slug, true);
      }
    }
  }, [allBrief.data, dispatch, router.isReady, projectSlug, setProject]);

  const problemLink = selectedProject.data?.lcLink;

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
      <ProjectBrowser
        onSelectProject={() => {
          dispatch(projectBrowserSlice.actions.setIsOpen(false));
        }}
      />

      <LoadingSkeletonOverlay />

      <TabContext value={tabValue}>
        <TabListWrapper>
          <TabList onChange={handleTabChange} aria-label={LL.PANEL_TABS()}>
            <Tab label={LL.PROJECT()} value="1" />
          </TabList>
          <Stack direction="row" spacing={1} alignItems="center" pr={1}>
            <Tooltip title={`${LL.PROJECT_BROWSER()} 📁`} arrow>
              <IconButton onClick={handleOpenBrowser}>
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
