import { Add } from '@mui/icons-material';
import { Box, CircularProgress, IconButton } from '@mui/material';
import type { PlaygroundSolution } from '@prisma/client';
import type { UseQueryResult } from '@tanstack/react-query';
import React, { useEffect } from 'react';

import { SelectBarChip } from '#/components/SelectBarChip';
import { trpc } from '#/utils';
import type { RouterOutputs } from '#/utils/trpc';

import { useAppDispatch, useAppSelector } from '#/store/hooks';
import {
  projectSlice,
  selectCurrentSolutionId,
} from '#/store/reducers/projectReducer';

type SolutionBrief = Pick<PlaygroundSolution, 'id' | 'title' | 'order'>;

type SolutionSelectBarProps = {
  selectedProject: UseQueryResult<RouterOutputs['project']['getById']>;
};

export const SolutionSelectBar: React.FC<SolutionSelectBarProps> = ({
  selectedProject,
}) => {
  const selectedSolutionId = useAppSelector(selectCurrentSolutionId);
  const selectedProjectId = selectedProject.data?.id;
  const solutions = selectedProject.data?.solutions;

  const dispatch = useAppDispatch();

  const trpcUtils = trpc.useContext();

  const addSolution = trpc.project.addSolution.useMutation({
    onSuccess: async (data, variables) => {
      await trpcUtils.project.getById.invalidate(variables.projectId);
      await trpcUtils.project.getSolutionById.invalidate({
        id: data.id,
        projectId: variables.projectId,
      });
      dispatch(projectSlice.actions.update({ currentSolutionId: data.id }));
    },
  });

  const deleteSolution = trpc.project.deleteSolution.useMutation({
    onSuccess: async (data, variables) => {
      if (selectedSolutionId === data.id) {
        const firstSolutionId = selectedProject.data?.solutions[0]?.id;
        dispatch(
          projectSlice.actions.update({
            currentSolutionId: firstSolutionId || null,
          })
        );
      }

      await trpcUtils.project.getById.invalidate(variables.projectId);
      await trpcUtils.project.getSolutionById.invalidate({
        id: variables.solutionId,
        projectId: variables.projectId,
      });
    },
  });

  const isLoading =
    selectedProject.isLoading ||
    addSolution.isLoading ||
    deleteSolution.isLoading;

  useEffect(() => {
    if (selectedSolutionId || !selectedProject.data) return;

    const firstSolutionId = selectedProject.data.solutions[0]?.id;

    firstSolutionId &&
      dispatch(
        projectSlice.actions.update({ currentSolutionId: firstSolutionId })
      );
  }, [selectedSolutionId, selectedProject.data, dispatch]);

  const handleCaseClick = (solution: SolutionBrief) => {
    dispatch(projectSlice.actions.update({ currentSolutionId: solution.id }));
  };

  const handleCaseDelete = (solution: SolutionBrief) => {
    if (!selectedProjectId) return;

    if (selectedSolutionId === solution.id) {
      const firstSolutionId = selectedProject.data?.solutions[0]?.id;
      dispatch(
        projectSlice.actions.update({
          currentSolutionId: firstSolutionId || null,
        })
      );
    }

    deleteSolution.mutate({
      projectId: selectedProjectId,
      solutionId: solution.id,
    });
  };

  const handleAddCase = () => {
    if (!selectedProjectId) return;

    addSolution.mutate({
      projectId: selectedProjectId,
      title: `Solution ${(solutions?.length ?? 0) + 1}`,
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
      {solutions?.map((solution) => {
        const isCurrent = solution.id === selectedSolutionId;

        return (
          <SelectBarChip
            key={solution.id}
            isCurrent={isCurrent}
            label={solution.title}
            disabled={isLoading}
            onClick={() => handleCaseClick(solution)}
            onDelete={() => {
              confirm(
                `Are you sure you want to delete the "${solution.title}" solution?  This action cannot be undone.`
              ) && handleCaseDelete(solution); //TODO: use a modal instead of prompt
            }}
          />
        );
      })}

      <IconButton
        title="Add new solution 🚀"
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
