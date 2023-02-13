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
import { usePlaygroundIds } from "#/hooks";
import { SolutionModal } from "#/layouts/modals";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { selectIsEditable } from "#/store/reducers/projectReducer";
import { trpc } from "#/utils";
import type { RouterOutputs } from "#/utils/trpc";

type SolutionBrief = Pick<PlaygroundSolution, "id" | "title" | "order">;

type SolutionSelectBarProps = StackProps & {
  selectedProject: UseQueryResult<RouterOutputs["project"]["getById"]>;
};

export const SolutionSelectBar: React.FC<SolutionSelectBarProps> = ({
  selectedProject,
  ...restProps
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    projectId: selectedProjectId,
    caseId,
    solutionId: selectedSolutionId,
    setSolution,
  } = usePlaygroundIds();
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
      void setSolution(data.id);
    },
  });

  const deleteSolution = trpc.project.deleteSolution.useMutation({
    onSuccess: async (data, variables) => {
      if (selectedSolutionId === data.id) {
        void setSolution("");
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
    if (selectedSolutionId || !selectedProject.data || !caseId) return;

    const firstSolutionId = selectedProject.data.solutions[0]?.id;

    firstSolutionId && setSolution(firstSolutionId);
  }, [selectedSolutionId, selectedProject.data, dispatch, setSolution, caseId]);

  const handleSolutionClick = (solution: SolutionBrief) => {
    void setSolution(solution.id);
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
              editLabel="Edit solution"
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
