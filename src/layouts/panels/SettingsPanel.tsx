import { AddCircle, Refresh } from '@mui/icons-material';
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
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from 'react';

import { useDebounce } from '#/hooks';
import type { BinaryTreeInput } from '#/hooks/useBinaryTree';
import { CreateProjectModal } from '#/layouts/modals';
import { PanelWrapper } from '#/layouts/panels/common/PanelWrapper';
import { StyledTabPanel, TabListWrapper } from '#/layouts/panels/common/styled';
import { trpc } from '#/utils';

type SettingsPanelProps = {
  setParsedInput: Dispatch<SetStateAction<BinaryTreeInput | undefined>>;
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  setParsedInput,
}) => {
  const [value, setValue] = useState('1');

  const { data: projects } = trpc.project.allBrief.useQuery();
  console.log('projects:\n', projects);

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const selectedProject = trpc.project.getById.useQuery(
    selectedProjectId || '',
    { enabled: Boolean(selectedProjectId) }
  );
  console.log('selectedProject:\n', selectedProject.data);

  useEffect(() => {
    if (projects?.length && !selectedProjectId) {
      const firstProject = projects[0];
      firstProject && setSelectedProjectId(firstProject.id);
    }
  }, [projects, selectedProjectId]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [rawInput, setRawInput] = useState<string>('[1,2,3,null,5]');
  const [inputError, setInputError] = useState<string | null>(null);
  const { value: input, isPending } = useDebounce(rawInput, 500);

  useEffect(() => {
    if (!selectedProject.data) return;

    const firstCase = selectedProject.data.cases[0]?.input;

    setRawInput(firstCase ?? '');
  }, [selectedProject.data]);

  useEffect(() => {
    console.log('input:\n', input);
    if (!input) {
      setInputError(null);
      setParsedInput(undefined);
    }

    try {
      const parsed = JSON.parse(input);
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
  }, [input, setParsedInput]);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  return (
    <PanelWrapper>
      <CreateProjectModal
        open={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />

      <TabContext value={value}>
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
                onChange={(e) => setSelectedProjectId(e.target.value)}
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
                <AddCircle />
              </IconButton>
            </Tooltip>
          </Box>

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
            <IconButton
              className="btn-refresh"
              onClick={() => setRawInput('[1,2,3,null,5]')}
              title="Reset input to default"
              disabled={isPending}
            >
              <Refresh />
            </IconButton>
            {isPending && <CircularProgress />}
          </Box>
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};
