import { Add } from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
  Stack,
  type StackProps,
} from "@mui/material";
import type { PlaygroundSolution } from "@prisma/client";
import type { UseQueryResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import {
  SelectBarChip,
  SelectBarChipSkeleton,
} from "#/components/SelectBarChip";
import { SolutionModal } from "#/layouts/modals";
import { trpc } from "#/utils";
import type { RouterOutputs } from "#/utils/trpc";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  projectSlice,
  selectCurrentSolutionId,
  selectIsEditable,
} from "#/store/reducers/projectReducer";

type SolutionBrief = Pick<PlaygroundSolution, "id" | "title" | "order">;

type SolutionSelectBarProps = StackProps & {
  selectedProject: UseQueryResult<RouterOutputs["project"]["getById"]>;
};

export const SolutionSelectBar: React.FC<SolutionSelectBarProps> = ({
  selectedProject,
  ...restProps
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        dispatch(
          projectSlice.actions.update({
            currentSolutionId: null,
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

  const isEditable = useAppSelector(selectIsEditable);

  useEffect(() => {
    if (selectedSolutionId || !selectedProject.data) return;

    const firstSolutionId = selectedProject.data.solutions[0]?.id;

    firstSolutionId &&
      dispatch(
        projectSlice.actions.update({ currentSolutionId: firstSolutionId })
      );
  }, [selectedSolutionId, selectedProject.data, dispatch]);

  const handleSolutionClick = (solution: SolutionBrief) => {
    dispatch(projectSlice.actions.update({ currentSolutionId: solution.id }));
  };

  const handleAddSolution = () => {
    if (!selectedProjectId) return;

    addSolution.mutate({
      projectId: selectedProjectId,
      title: `Solution ${(solutions?.length ?? 0) + 1}`,
    });
  };

  const handleSolutionEdit = (solution: SolutionBrief) => {
    handleSolutionClick(solution);
    setIsModalOpen(true);
  };

  return (
    <>
      <SolutionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Stack flexWrap="wrap" direction="row" gap={1} {...restProps}>
        {!selectedProject.data && (
          <>
            <SelectBarChipSkeleton width={112} />
            <SelectBarChipSkeleton width={42} />
            <SelectBarChipSkeleton />
            <SelectBarChipSkeleton width={24} />
          </>
        )}

        {solutions?.map((solution) => {
          const isCurrent = solution.id === selectedSolutionId;

          return (
            <SelectBarChip
              key={solution.id}
              isCurrent={isCurrent}
              isEditable={isEditable}
              label={solution.title}
              disabled={isLoading}
              onClick={() => handleSolutionClick(solution)}
              onEditClick={() => handleSolutionEdit(solution)}
            />
          );
        })}

        {isEditable && (
          <IconButton
            title="Add new solution 🚀"
            size="small"
            onClick={handleAddSolution}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size="1.3rem" />
            ) : (
              <Add fontSize="small" />
            )}
          </IconButton>
        )}
      </Stack>
    </>
  );
};
