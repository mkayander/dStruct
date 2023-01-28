import { Add } from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  TextField,
  Tooltip,
} from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { TestCaseSelectBar } from "#/components";
import { useBinaryTree } from "#/hooks";
import type { BinaryTreeInput } from "#/hooks/useBinaryTree";
import { CreateProjectModal } from "#/layouts/modals";
import { PanelWrapper } from "#/layouts/panels/common/PanelWrapper";
import { StyledTabPanel, TabListWrapper } from "#/layouts/panels/common/styled";
import { trpc } from "#/utils";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  projectSlice,
  selectCurrentCaseId,
  selectCurrentProjectId,
  selectIsEditable,
} from "#/store/reducers/projectReducer";

export const ProjectPanel: React.FC = () => {
  const session = useSession();
  const dispatch = useAppDispatch();

  const [tabValue, setTabValue] = useState("1");
  const [parsedInput, setParsedInput] = useState<BinaryTreeInput | undefined>();
  const [rawInput, setRawInput] = useState<string>("[]");
  const [inputError, setInputError] = useState<string | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // const { value: debouncedInput, isPending } = useDebounce(rawInput, 500);

  const { data: projects } = trpc.project.allBrief.useQuery();

  const selectedProjectId = useAppSelector(selectCurrentProjectId) ?? "";
  const selectedCaseId = useAppSelector(selectCurrentCaseId);
  const isEditable = useAppSelector(selectIsEditable);

  const selectedProject = trpc.project.getById.useQuery(
    selectedProjectId || "",
    {
      enabled: Boolean(selectedProjectId),
    }
  );

  const selectedCase = trpc.project.getCaseById.useQuery(
    { id: selectedCaseId ?? "", projectId: selectedProjectId },
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
    if (projects?.length && !selectedProjectId) {
      const firstProject = projects[0];
      firstProject &&
        dispatch(
          projectSlice.actions.update({ currentProjectId: firstProject.id })
        );
    }
  }, [dispatch, projects, selectedProjectId]);

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
      if (inputError || !parsedInput || !selectedCaseId) return;

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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <PanelWrapper>
      <CreateProjectModal
        open={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />

      <TabContext value={tabValue}>
        <TabListWrapper>
          <TabList onChange={handleChange} aria-label="panel tabs">
            <Tab label="Project" value="1" />
          </TabList>
        </TabListWrapper>

        <StyledTabPanel
          value="1"
          sx={{ display: "flex", flexFlow: "column nowrap", gap: 1 }}
        >
          <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
            <FormControl fullWidth>
              <InputLabel id="project-select-label">Select project</InputLabel>
              <Select
                id="project-select"
                labelId="project-select-label"
                label="Select project"
                defaultValue=""
                value={selectedProjectId}
                onChange={(e) =>
                  dispatch(
                    projectSlice.actions.update({
                      currentProjectId: e.target.value,
                    })
                  )
                }
              >
                {projects?.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {isEditable && (
              <Tooltip title="Create new project ➕" arrow>
                <IconButton onClick={() => setIsProjectModalOpen(true)}>
                  <Add />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <TestCaseSelectBar selectedProject={selectedProject} />

          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              mt: 1,
              gap: 2,
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
            />
            <CircularProgress
              sx={{
                transition: "opacity .2s",
                opacity: updateCase.isLoading ? 1 : 0,
              }}
            />
          </Box>
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
