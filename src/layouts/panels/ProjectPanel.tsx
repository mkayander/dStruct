import { Add, Edit } from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import {
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Skeleton,
  Stack,
  Tab,
  TextField,
  Tooltip,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { TestCaseSelectBar } from "#/components";
import { useBinaryTree, usePlaygroundIds } from "#/hooks";
import type { BinaryTreeInput } from "#/hooks/useBinaryTree";
import { ProjectModal } from "#/layouts/modals";
import { PanelWrapper } from "#/layouts/panels/common/PanelWrapper";
import { StyledTabPanel, TabListWrapper } from "#/layouts/panels/common/styled";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  projectSlice,
  selectIsEditable,
} from "#/store/reducers/projectReducer";
import { trpc } from "#/utils";

export const ProjectPanel: React.FC = () => {
  const session = useSession();
  const dispatch = useAppDispatch();

  const router = useRouter();
  console.log(router.pathname, router.query);
  const {
    projectId: selectedProjectId = "",
    caseId: selectedCaseId = "",
    setProject,
  } = usePlaygroundIds();

  const [tabValue, setTabValue] = useState("1");
  const [parsedInput, setParsedInput] = useState<BinaryTreeInput | undefined>();
  const [rawInput, setRawInput] = useState<string>("[]");
  const [inputError, setInputError] = useState<string | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isModalEditMode, setIsModalEditMode] = useState(false);

  const allBrief = trpc.project.allBrief.useQuery();

  const isEditable = useAppSelector(selectIsEditable);

  const selectedProject = trpc.project.getById.useQuery(selectedProjectId, {
    enabled: Boolean(selectedProjectId),
  });

  const selectedCase = trpc.project.getCaseById.useQuery(
    { id: selectedCaseId, projectId: selectedProjectId },
    { enabled: Boolean(selectedProjectId && selectedCaseId) }
  );

  const updateCase = trpc.project.updateCase.useMutation();

  useEffect(() => {
    if (!selectedProject.data || !session.data) {
      isEditable &&
        dispatch(projectSlice.actions.update({ isEditable: false }));
      return;
    }

    dispatch(
      projectSlice.actions.update({
        isEditable: selectedProject.data.userId === session.data.user.id,
      })
    );
  }, [dispatch, isEditable, selectedProject.data, session.data]);

  useEffect(() => {
    console.log("selectedProjectId:", selectedProjectId);
    if (allBrief.data?.length && router.isReady && !selectedProjectId) {
      const firstProject = allBrief.data[0];
      firstProject && setProject(firstProject.id);
    }
  }, [allBrief.data, dispatch, router.isReady, selectedProjectId, setProject]);

  useEffect(() => {
    if (selectedCase.data) {
      setRawInput(selectedCase.data.input);
    }
  }, [selectedCase.data]);

  useEffect(() => {
    if (!rawInput) {
      setInputError(null);
      setParsedInput(undefined);
    }

    try {
      const parsed = JSON.parse(rawInput);
      if (Array.isArray(parsed)) {
        setInputError(null);
        setParsedInput(parsed);
      } else {
        setInputError(`Input must be an array, but got ${typeof parsed}`);
        setParsedInput(undefined);
      }
    } catch (e: any) {
      setInputError(e.message);
      setParsedInput(undefined);
    }
  }, [rawInput, setParsedInput]);

  const trpcUtils = trpc.useContext();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputError || !parsedInput || !selectedCaseId || !isEditable) return;

      updateCase.mutate(
        {
          caseId: selectedCaseId,
          projectId: selectedProjectId,
          input: rawInput,
        },
        {
          onSuccess: (data) => {
            trpcUtils.project.getCaseById.setData(data, (input) => input);
          },
        }
      );
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputError, rawInput]);

  useBinaryTree(parsedInput);

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

  return (
    <PanelWrapper>
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
          sx={{ display: "flex", flexFlow: "column nowrap", gap: 1 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="project-select-label">Current Project</InputLabel>
              <Select
                id="project-select"
                labelId="project-select-label"
                label="Current Project"
                defaultValue=""
                value={allBrief.isLoading ? "" : selectedProjectId}
                onChange={handleSelectProject}
                disabled={allBrief.isLoading}
              >
                {allBrief.data?.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.title}
                  </MenuItem>
                ))}
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

          <Stack
            direction="row"
            mt={1}
            spacing={2}
            alignItems="start"
            sx={{
              "button.btn-refresh": { mt: 1 },
            }}
          >
            <TextField
              label="Input array"
              placeholder="e.g.: [1,2,3,null,5]"
              value={rawInput}
              onChange={(ev) => setRawInput(ev.target.value)}
              error={!!inputError}
              helperText={inputError || "Must be a JSON array of numbers"}
              fullWidth
              disabled={selectedProject.isLoading}
            />
            <div>
              <CircularProgress
                sx={{
                  transition: "opacity .2s",
                  opacity: updateCase.isLoading ? 1 : 0,
                }}
              />
            </div>
          </Stack>
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
