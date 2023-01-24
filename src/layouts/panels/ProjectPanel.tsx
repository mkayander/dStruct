import { Add } from '@mui/icons-material';
import { TabContext, TabList } from '@mui/lab';
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
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { TestCaseSelectBar } from '#/components';
import { useBinaryTree } from '#/hooks';
import type { BinaryTreeInput } from '#/hooks/useBinaryTree';
import { CreateProjectModal } from '#/layouts/modals';
import { PanelWrapper } from '#/layouts/panels/common/PanelWrapper';
import { StyledTabPanel, TabListWrapper } from '#/layouts/panels/common/styled';
import { trpc } from '#/utils';

import { useAppDispatch, useAppSelector } from '#/store/hooks';
import {
  projectSlice,
  selectCurrentCaseId,
  selectCurrentProjectId,
} from '#/store/reducers/projectReducer';

export const ProjectPanel: React.FC = () => {
  const dispatch = useAppDispatch();

  const [tabValue, setTabValue] = useState('1');
  const [parsedInput, setParsedInput] = useState<BinaryTreeInput | undefined>();
  const [rawInput, setRawInput] = useState<string>('[]');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // const { value: debouncedInput, isPending } = useDebounce(rawInput, 500);
  const debouncedInput = rawInput;
  const isPending = false;

  const { data: projects } = trpc.project.allBrief.useQuery();

  const selectedProjectId = useAppSelector(selectCurrentProjectId) ?? '';
  const selectedCaseId = useAppSelector(selectCurrentCaseId);

  const selectedProject = trpc.project.getById.useQuery(
    selectedProjectId || '',
    {
      enabled: Boolean(selectedProjectId),
    }
  );

  const selectedCase = trpc.project.getCaseById.useQuery(
    { projectId: selectedProjectId, caseId: selectedCaseId ?? '' },
    { enabled: Boolean(selectedProjectId && selectedCaseId) }
  );

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
    if (!debouncedInput) {
      setInputError(null);
      setParsedInput(undefined);
    }

    try {
      const parsed = JSON.parse(debouncedInput);
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
  }, [debouncedInput, setParsedInput]);

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
          sx={{ display: 'flex', flexFlow: 'column nowrap', gap: 1 }}
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
            <Tooltip title="Create new project ➕" arrow>
              <IconButton onClick={() => setIsProjectModalOpen(true)}>
                <Add />
              </IconButton>
            </Tooltip>
          </Box>

          <TestCaseSelectBar selectedProject={selectedProject} />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'start',
              mt: 1,
              gap: 2,
              'button.btn-refresh': { mt: 1 },
            }}
          >
            <TextField
              label="Input array"
              placeholder="e.g.: [1,2,3,null,5]"
              value={rawInput}
              onChange={(ev) => setRawInput(ev.target.value)}
              error={!!inputError}
              helperText={inputError || 'Must be a JSON array of numbers'}
            />
            {isPending && <CircularProgress />}
          </Box>
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
