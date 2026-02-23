"use client";

import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { StackProps } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

import { selectIsEditable } from "#/features/project/model/projectSlice";
import { DraggableSelectBarList } from "#/features/selectBar/ui/DraggableSelectBarList";
import { DraggableSelectBarChip } from "#/features/selectBar/ui/SelectBarChip";
import type { UseTRPCQueryResult } from "#/server/api/trpc";
import type { PlaygroundTestCase } from "#/server/db/generated/browser";
import { api } from "#/shared/api";
import type { RouterOutputs } from "#/shared/api";
import { usePlaygroundSlugs } from "#/shared/hooks";
import { useI18nContext } from "#/shared/hooks";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

import { CaseModal } from "./CaseModal";

type TestCaseBrief = Pick<
  PlaygroundTestCase,
  "id" | "order" | "slug" | "title"
>;

type TestCaseSelectBarProps = StackProps & {
  selectedProject: UseTRPCQueryResult<RouterOutputs["project"]["getBySlug"]>;
};

export const TestCaseSelectBar: React.FC<TestCaseSelectBarProps> = ({
  selectedProject,
  ...restProps
}) => {
  const { LL } = useI18nContext();
  const dispatch = useAppDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { projectSlug = "", caseSlug = "", setCase } = usePlaygroundSlugs();

  const invalidateQueries = async (slug?: string) => {
    await trpcUtils.project.getBySlug.invalidate(projectSlug);
    await trpcUtils.project.getCaseBySlug.invalidate({
      projectId: selectedProject.data?.id || "",
      slug: slug || caseSlug,
    });
  };

  const trpcUtils = api.useUtils();

  const updateCasesCache = (cases: TestCaseBrief[]) => {
    trpcUtils.project.getBySlug.setData(projectSlug, (prevData) => {
      if (!prevData) return prevData;

      return {
        ...prevData,
        cases,
      };
    });
  };

  const addCase = api.project.addCase.useMutation({
    onSuccess: async (data) => {
      await invalidateQueries(data.slug);
      void setCase(data.slug);

      enqueueSnackbar(`🧪 Test case "${data.title}" created successfully! 🎉`, {
        variant: "success",
      });
    },
  });

  const reorderCases = api.project.reorderCases.useMutation({
    onSuccess: async (data) => {
      updateCasesCache(data);
    },
  });

  const deleteCase = api.project.deleteCase.useMutation({
    onSuccess: async (data) => {
      await invalidateQueries(data.slug);

      if (caseSlug === data.slug) {
        void setCase("");
      }
    },
  });

  const cases = selectedProject.data?.cases;

  const isLoading =
    selectedProject.isLoading || addCase.isPending || deleteCase.isPending;

  const isEditable = useAppSelector(selectIsEditable);

  useEffect(() => {
    if (caseSlug || !selectedProject.data) return;

    const firstCaseSlug = selectedProject.data.cases[0]?.slug;

    if (firstCaseSlug) {
      setCase(firstCaseSlug);
    }
  }, [caseSlug, selectedProject.data, dispatch, setCase]);

  const handleCaseClick = (testCase: TestCaseBrief) => {
    void setCase(testCase.slug);
  };

  const handleCaseEdit = (testCase: TestCaseBrief) => {
    handleCaseClick(testCase);
    setIsModalOpen(true);
  };

  const handleAddCase = () => {
    if (!selectedProject.data) return;

    const order = cases?.length ?? 0;

    addCase.mutate({
      projectId: selectedProject.data.id,
      order,
      referenceCaseSlug: caseSlug,
    });
  };

  const onItemDragEnd: OnDragEndResponder = (result) => {
    if (
      !result.destination ||
      result.destination.index === result.source.index ||
      !cases ||
      !selectedProject.data
    ) {
      return;
    }

    const { source, destination } = result;

    const newList: TestCaseBrief[] = Array.from(cases);
    const removed = newList.splice(source.index, 1);
    newList.splice(destination.index, 0, ...removed);

    updateCasesCache(newList);

    reorderCases.mutate({
      projectId: selectedProject.data.id,
      caseIds: newList.map((solution) => solution.id),
    });
  };

  return (
    <>
      <CaseModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <DraggableSelectBarList
        droppableId="droppable-solutions"
        isLoading={isLoading}
        isEmpty={!selectedProject.data}
        onItemDragEnd={onItemDragEnd}
        addItemTitle="Add new test case 🧪"
        handleAddItem={handleAddCase}
        isEditable={isEditable}
        {...restProps}
      >
        {(_, droppableSnapshot) =>
          cases?.map((testCase, index) => (
            <DraggableSelectBarChip
              id={testCase.id}
              key={testCase.id}
              index={index}
              droppableSnapshot={droppableSnapshot}
              editLabel={LL.EDIT_TEST_CASE()}
              isCurrent={testCase.slug === caseSlug}
              isEditable={isEditable}
              label={testCase.title}
              disabled={isLoading}
              onClick={() => handleCaseClick(testCase)}
              onEditClick={() => handleCaseEdit(testCase)}
            />
          ))
        }
      </DraggableSelectBarList>
    </>
  );
};
