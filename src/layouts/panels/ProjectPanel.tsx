import { Add, Edit } from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import {
  Avatar,
  FormControl,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Skeleton,
  Stack,
  Tab,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

import { ArgsEditor, TestCaseSelectBar } from "#/components";
import { useArgumentsParsing, usePlaygroundSlugs } from "#/hooks";
import { ProjectModal } from "#/layouts/modals";
import { PanelWrapper } from "#/layouts/panels/common/PanelWrapper";
import { StyledTabPanel, TabListWrapper } from "#/layouts/panels/common/styled";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  projectSlice,
  selectIsEditable,
} from "#/store/reducers/projectReducer";
import { categoryLabels, getImageUrl, trpc } from "#/utils";

export const ProjectPanel: React.FC = () => {
  const session = useSession();
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { projectSlug = "", caseSlug = "", setProject } = usePlaygroundSlugs();

  const [tabValue, setTabValue] = useState("1");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isModalEditMode, setIsModalEditMode] = useState(false);

  const allBrief = trpc.project.allBrief.useQuery();

  const isEditable = useAppSelector(selectIsEditable);

  const selectedProject = trpc.project.getBySlug.useQuery(projectSlug, {
    enabled: Boolean(projectSlug),
  });

  const selectedCase = trpc.project.getCaseBySlug.useQuery(
    { projectId: selectedProject.data?.id || "", slug: caseSlug },
    { enabled: Boolean(selectedProject.data?.id && caseSlug) }
  );

  useEffect(() => {
    dispatch(
      projectSlice.actions.update({ projectId: selectedProject.data?.id })
    );
  }, [dispatch, selectedProject.data?.id]);

  useEffect(() => {
    if (!selectedProject.data || !session.data) {
      isEditable &&
        dispatch(projectSlice.actions.update({ isEditable: false }));
      return;
    }

    const newState = selectedProject.data.userId === session.data.user.id;
    isEditable !== newState &&
      dispatch(
        projectSlice.actions.update({
          isEditable: newState,
        })
      );
  }, [dispatch, isEditable, selectedProject.data, session.data]);

  useEffect(() => {
    if (allBrief.data?.length && router.isReady && !projectSlug) {
      const firstProject = allBrief.data[0];
      firstProject && setProject(firstProject.slug);
    }
  }, [allBrief.data, dispatch, router.isReady, projectSlug, setProject]);

  useArgumentsParsing();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const handleSelectProject = (e: SelectChangeEvent) => {
    void setProject(e.target.value);
  };

  const handleCreateProject = () => {
    setIsModalEditMode(false);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = () => {
    setIsModalEditMode(true);
    setIsProjectModalOpen(true);
  };

  const projectSelectItems = useMemo(() => {
    let lastCategory = "";
    const elements: JSX.Element[] = [];
    for (const project of allBrief.data ?? []) {
      if (lastCategory !== project.category) {
        lastCategory = project.category;
        elements.push(
          <ListSubheader key={project.category} disableSticky>
            {categoryLabels[project.category]}
          </ListSubheader>
        );
      }

      elements.push(
        <MenuItem key={project.id} value={project.slug}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            overflow="hidden"
            spacing={1}
          >
            <span>{project.title}</span>
            <Stack
              direction="row"
              alignItems="center"
              minWidth={10}
              overflow="hidden"
              spacing={1}
            >
              <Typography
                fontSize={12}
                variant="subtitle1"
                textOverflow="ellipsis"
                overflow="hidden"
                sx={{ opacity: 0.6 }}
              >
                {categoryLabels[project.category]}
              </Typography>
              {project.author?.bucketImage && (
                <Tooltip title={`Author: ${project.author.name}`} arrow>
                  <Avatar
                    src={getImageUrl(project.author.bucketImage)}
                    alt={`${project.author.name} avatar`}
                    sx={{ height: 24, width: 24 }}
                  />
                </Tooltip>
              )}
            </Stack>
          </Stack>
        </MenuItem>
      );
    }

    return elements;
  }, [allBrief.data]);

  return (
    <PanelWrapper>
      <Head>
        <title>
          {selectedProject.data ? `${selectedProject.data?.title} - ` : ""}
          dStruct Playground
        </title>
      </Head>
      <ProjectModal
        open={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        isEditMode={isModalEditMode}
        currentProject={selectedProject.data}
      />

      {allBrief.isLoading && (
        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{
            position: "absolute",
            background: "transparent",
            height: "100%",
            width: "100%",
            top: 0,
            left: 0,
            zIndex: 10,
            cursor: "wait",
          }}
        />
      )}

      <TabContext value={tabValue}>
        <TabListWrapper>
          <TabList onChange={handleTabChange} aria-label="panel tabs">
            <Tab label="Project" value="1" />
          </TabList>
        </TabListWrapper>

        <StyledTabPanel
          value="1"
          sx={{ display: "flex", flexFlow: "column nowrap", p: 2, gap: 1 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="project-select-label">Current Project</InputLabel>
              <Select
                id="project-select"
                labelId="project-select-label"
                label="Current Project"
                defaultValue=""
                value={allBrief.isLoading ? "" : projectSlug}
                onChange={handleSelectProject}
                disabled={allBrief.isLoading}
              >
                {projectSelectItems}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={0.5}>
              {isEditable && (
                <Tooltip title="Edit selected project ✍" arrow>
                  <IconButton onClick={handleEditProject}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              )}
              {session.data && (
                <Tooltip title="Create new project ➕" arrow>
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
