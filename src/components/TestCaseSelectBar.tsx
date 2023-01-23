import { Add } from '@mui/icons-material';
import { Box, Chip, CircularProgress, IconButton } from '@mui/material';
import React, { useEffect } from 'react';

import { trpc } from '#/utils';

import { useAppDispatch, useAppSelector } from '#/store/hooks';
import {
  projectSlice,
  selectCurrentCaseId,
} from '#/store/reducers/projectReducer';

import type { PlaygroundTestCase } from '.prisma/client';

type TestCaseSelectBarProps = {
  selectedProjectId: string;
};

export const TestCaseSelectBar: React.FC<TestCaseSelectBarProps> = ({
  selectedProjectId,
}) => {
  const selectedProject = trpc.project.getById.useQuery(
    selectedProjectId || '',
    {
      enabled: Boolean(selectedProjectId),
    }
  );
  const selectedCaseId = useAppSelector(selectCurrentCaseId);

  const dispatch = useAppDispatch();

  const trpcUtils = trpc.useContext();
  const addCase = trpc.project.addCase.useMutation({
    onSuccess: async (data, variables) => {
      await trpcUtils.project.getById.invalidate(variables.projectId);
      await trpcUtils.project.getCaseById.invalidate({
        projectId: variables.projectId,
        caseId: data.id,
      });
    },
  });
  const deleteCase = trpc.project.deleteCase.useMutation({
    onSuccess: async (data, variables) => {
      await trpcUtils.project.getById.invalidate(variables.projectId);
      await trpcUtils.project.getCaseById.invalidate({
        projectId: variables.projectId,
        caseId: variables.caseId,
      });
    },
  });

  const cases = selectedProject.data?.cases;
  const isLoading =
    selectedProject.isLoading || addCase.isLoading || deleteCase.isLoading;

  useEffect(() => {
    if (selectedCaseId || !selectedProject.data) return;

    const firstCaseId = selectedProject.data.cases[0]?.id;

    firstCaseId &&
      dispatch(projectSlice.actions.update({ currentCaseId: firstCaseId }));
  }, [selectedCaseId, selectedProject.data, dispatch]);

  const handleCaseClick = (testCase: PlaygroundTestCase) => {
    dispatch(projectSlice.actions.update({ currentCaseId: testCase.id }));
    // dispatch(projectSlice.actions.setCurrentCase(testCase));
  };

  const handleCaseDelete = (testCase: PlaygroundTestCase) => {
    if (selectedCaseId === testCase.id) {
      const firstCaseId = selectedProject.data?.cases[0]?.id;
      dispatch(
        projectSlice.actions.update({ currentCaseId: firstCaseId || null })
      );
    }

    deleteCase.mutate({ projectId: selectedProjectId, caseId: testCase.id });
  };

  const handleAddCase = () => {
    addCase.mutate({
      projectId: selectedProjectId,
      title: `Case ${(cases?.length ?? 0) + 1}`,
      input: '[]',
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      alignItems="center"
      gap={1}
    >
      {cases?.map((testCase) => {
        const isCurrent = testCase.id === selectedCaseId;

        return (
          <Chip
            key={testCase.id}
            label={testCase.title}
            disabled={isLoading}
            onClick={() => handleCaseClick(testCase)}
            onDelete={() => {
              handleCaseDelete(testCase);
            }} // TODO: Make a separate delete icon
            variant={isCurrent ? 'filled' : 'outlined'}
            size="small"
            sx={{
              '.MuiChip-deleteIcon': {
                transition: '0.2s',
                opacity: 0,
                position: 'absolute',
                top: '-4px',
                right: '-10px',
                zIndex: 10,
              },
              '&:hover': {
                '.MuiChip-deleteIcon': {
                  opacity: 1,
                },
              },
            }}
          />
        );
      })}

      <IconButton
        title="Add new test case 🧪"
        size="small"
        onClick={handleAddCase}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size="1.3rem" />
        ) : (
          <Add fontSize="small" />
        )}
      </IconButton>
    </Box>
  );
};
