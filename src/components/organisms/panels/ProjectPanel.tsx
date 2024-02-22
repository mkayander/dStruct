import { Add, Edit } from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import { IconButton, Stack, Tab, Tooltip } from "@mui/material";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { LoadingSkeletonOverlay } from "#/components/atoms/LoadingSkeletonOverlay";
import { ProblemLinkButton } from "#/components/atoms/ProblemLinkButton";
import { ArgsEditor } from "#/components/molecules/ArgsEditor/ArgsEditor";
import { ProjectSelect } from "#/components/molecules/ProjectSelect";
import { TestCaseSelectBar } from "#/components/molecules/SelectBar/TestCaseSelectBar";
import { ProjectModal } from "#/components/organisms/modals";
import { PanelWrapper } from "#/components/organisms/panels/common/PanelWrapper";
import {
  StyledTabPanel,
  TabListWrapper,
} from "#/components/organisms/panels/common/styled";
import { usePlaygroundSlugs } from "#/hooks";
import { useI18nContext } from "#/hooks";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  projectSlice,
  selectIsEditable,
} from "#/store/reducers/projectReducer";
import { trpc } from "#/utils";

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

  const allBrief = trpc.project.allBrief.useQuery();

  const isEditable = useAppSelector(selectIsEditable);

  const selectedProject = trpc.project.getBySlug.useQuery(projectSlug, {
    enabled: Boolean(projectSlug),
    retry(failureCount, error) {
      if (error instanceof TRPCClientError && error.data.code === "NOT_FOUND") {
        return false;
      }

      return failureCount < 4;
    },
  });

  const selectedCase = trpc.project.getCaseBySlug.useQuery(
    { projectId: selectedProject.data?.id || "", slug: caseSlug },
    { enabled: Boolean(selectedProject.data?.id && caseSlug) },
  );

  useEffect(() => {
    dispatch(
      projectSlice.actions.update({ projectId: selectedProject.data?.id }),
    );
  }, [dispatch, selectedProject.data?.id]);

  useEffect(() => {
    if (selectedProject.error) {
      console.log("selectedProject.error2: ", selectedProject.error);
      clearSlugs();
      return;
    }
    if (!selectedProject.data || !session.data) {
      isEditable &&
        dispatch(projectSlice.actions.update({ isEditable: false }));
      return;
    }

    const user = session.data.user;

    const newState = user.isAdmin || selectedProject.data.userId === user.id;
    isEditable !== newState &&
      dispatch(
        projectSlice.actions.update({
          isEditable: newState,
        }),
      );
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
      firstProject && setProject(firstProject.slug, true);
    }
  }, [allBrief.data, dispatch, router.isReady, projectSlug, setProject]);

  const problemLink = selectedProject.data?.lcLink;

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
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
            {problemLink && <ProblemLinkButton problemLink={problemLink} />}
          </Stack>
        </TabListWrapper>

        <StyledTabPanel
          value="1"
          sx={{ display: "flex", flexFlow: "column nowrap", p: 2, gap: 1 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <ProjectSelect allBrief={allBrief} />
            <Stack direction="row" spacing={0.5}>
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
          </Stack>

          <TestCaseSelectBar selectedProject={selectedProject} />

          <ArgsEditor selectedCase={selectedCase} />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
