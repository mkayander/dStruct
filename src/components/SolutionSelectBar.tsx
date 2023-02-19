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
import { usePlaygroundSlugs } from "#/hooks";
import { SolutionModal } from "#/layouts/modals";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { selectIsEditable } from "#/store/reducers/projectReducer";
import { trpc } from "#/utils";
import type { RouterOutputs } from "#/utils/trpc";

type SolutionBrief = Pick<
  PlaygroundSolution,
  "id" | "slug" | "title" | "order"
>;

type SolutionSelectBarProps = StackProps & {
  selectedProject: UseQueryResult<RouterOutputs["project"]["getBySlug"]>;
};

export const SolutionSelectBar: React.FC<SolutionSelectBarProps> = ({
  selectedProject,
  ...restProps
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    projectSlug = "",
    caseSlug = "",
    solutionSlug = "",
    setSolution,
  } = usePlaygroundSlugs();
  const solutions = selectedProject.data?.solutions;

  const dispatch = useAppDispatch();

  const trpcUtils = trpc.useContext();

  const invalidateQueries = async (slug?: string) => {
    await trpcUtils.project.getBySlug.invalidate(projectSlug);
    await trpcUtils.project.getSolutionBySlug.invalidate({
      slug: slug || solutionSlug,
    });
  };

  const addSolution = trpc.project.addSolution.useMutation({
    onSuccess: async (data) => {
      await invalidateQueries(data.slug);
      void setSolution(data.slug);
    },
  });

  const deleteSolution = trpc.project.deleteSolution.useMutation({
    onSuccess: async (data) => {
      await invalidateQueries();

      if (solutionSlug === data.slug) {
        void setSolution("");
      }
    },
  });

  const isLoading =
    selectedProject.isLoading ||
    addSolution.isLoading ||
    deleteSolution.isLoading;

  const isEditable = useAppSelector(selectIsEditable);

  useEffect(() => {
    if (solutionSlug || !selectedProject.data || !caseSlug) return;

    const firstSolutionSlug = selectedProject.data.solutions[0]?.slug;

    firstSolutionSlug && setSolution(firstSolutionSlug);
  }, [solutionSlug, selectedProject.data, dispatch, setSolution, caseSlug]);

  const handleSolutionClick = (solution: SolutionBrief) => {
    void setSolution(solution.slug);
  };

  const handleAddSolution = () => {
    if (!selectedProject.data) return;

    addSolution.mutate({
      projectId: selectedProject.data.id,
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
          const isCurrent = solution.slug === solutionSlug;

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
