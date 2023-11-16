"use client";

import { type StackProps } from "@mui/material";
import type { PlaygroundSolution } from "@prisma/client";
import type { UseQueryResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { type OnDragEndResponder } from "react-beautiful-dnd";
import { SolutionModal } from "src/components/organisms/modals";

import { DraggableSelectBarList } from "#/components/molecules/SelectBar/DraggableSelectBarList";
import { DraggableSelectBarChip } from "#/components/molecules/SelectBar/SelectBarChip";
import { usePlaygroundSlugs } from "#/hooks";
import { useI18nContext } from "#/hooks";
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
  const { LL } = useI18nContext();

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

  const onItemDragEnd: OnDragEndResponder = (result) => {
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
      <DraggableSelectBarList
        droppableId="droppable-solutions"
        isLoading={isLoading}
        isEmpty={!selectedProject.data}
        onItemDragEnd={onItemDragEnd}
        addItemTitle={LL.ADD_NEW_SOLUTION()}
        handleAddItem={handleAddSolution}
        isEditable={isEditable}
        {...restProps}
      >
        {(provided, droppableSnapshot) =>
          solutions?.map((solution, index) => (
            <DraggableSelectBarChip
              id={solution.id}
              key={solution.id}
              index={index}
              droppableSnapshot={droppableSnapshot}
              editLabel={LL.EDIT_SOLUTION()}
              isCurrent={solution.slug === solutionSlug}
              isEditable={isEditable}
              label={solution.title}
              disabled={isLoading}
              onClick={() => handleSolutionClick(solution)}
              onEditClick={() => handleSolutionEdit(solution)}
            />
          ))
        }
      </DraggableSelectBarList>
    </>
  );
};
