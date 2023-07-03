"use client";

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
import { DragDropContext, type Responders } from "react-beautiful-dnd";

import {
  DraggableSelectBarChip,
  SelectBarChipSkeleton,
} from "#/components/SelectBar/SelectBarChip";
import { StrictModeDroppable } from "#/components/SelectBar/StrictModeDroppable";
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

  const updateSolutionsCache = (solutions: SolutionBrief[]) => {
    trpcUtils.project.getBySlug.setData(projectSlug, (prevData) => {
      if (!prevData) return prevData;

      return {
        ...prevData,
        solutions,
      };
    });
  };

  const invalidateQueries = async (slug?: string) => {
    await trpcUtils.project.getBySlug.invalidate(projectSlug);
    await trpcUtils.project.getSolutionBySlug.invalidate({
      projectId: selectedProject.data?.id || "",
      slug: slug || solutionSlug,
    });
  };

  const addSolution = trpc.project.addSolution.useMutation({
    onSuccess: async (data) => {
      await invalidateQueries(data.slug);
      void setSolution(data.slug);
    },
  });

  const reorderSolutions = trpc.project.reorderSolutions.useMutation({
    onSuccess: async (newList) => {
      updateSolutionsCache(newList);
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

    const order = solutions?.length ?? 0;

    addSolution.mutate({
      projectId: selectedProject.data.id,
      order,
      referenceSolutionSlug: solutionSlug,
    });
  };

  const handleSolutionEdit = (solution: SolutionBrief) => {
    handleSolutionClick(solution);
    setIsModalOpen(true);
  };

  const onDragEnd: Responders["onDragEnd"] = (result) => {
    if (
      !result.destination ||
      result.destination.index === result.source.index ||
      !solutions ||
      !selectedProject.data
    ) {
      return;
    }

    const { source, destination } = result;

    const newList: SolutionBrief[] = Array.from(solutions);
    const removed = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, ...removed);

    updateSolutionsCache(newList);

    reorderSolutions.mutate({
      projectId: selectedProject.data.id,
      solutionIds: newList.map((solution) => solution.id),
    });
  };

  return (
    <>
      <SolutionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable
          droppableId="droppable-solution"
          direction="horizontal"
        >
          {(provided, droppableSnapshot) => (
            <Stack
              {...provided.droppableProps}
              ref={provided.innerRef}
              flexWrap="wrap"
              direction="row"
              gap={1}
              {...restProps}
            >
              {!selectedProject.data && (
                <>
                  <SelectBarChipSkeleton width={112} />
                  <SelectBarChipSkeleton width={42} />
                  <SelectBarChipSkeleton />
                  <SelectBarChipSkeleton width={24} />
                </>
              )}

              {solutions?.map((solution, index) => (
                <DraggableSelectBarChip
                  id={solution.id}
                  key={solution.id}
                  index={index}
                  droppableSnapshot={droppableSnapshot}
                  editLabel="Edit solution"
                  isCurrent={solution.slug === solutionSlug}
                  isEditable={isEditable}
                  label={solution.title}
                  disabled={isLoading}
                  onClick={() => handleSolutionClick(solution)}
                  onEditClick={() => handleSolutionEdit(solution)}
                />
              ))}
              {provided.placeholder}

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
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </>
  );
};
