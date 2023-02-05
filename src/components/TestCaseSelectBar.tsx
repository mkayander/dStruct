import { Add } from "@mui/icons-material";
import { CircularProgress, IconButton, Stack } from "@mui/material";
import type { PlaygroundTestCase } from "@prisma/client";
import type { UseQueryResult } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

import {
  SelectBarChip,
  SelectBarChipSkeleton,
} from "#/components/SelectBarChip";
import { CaseModal } from "#/layouts/modals";
import { trpc } from "#/utils";
import type { RouterOutputs } from "#/utils/trpc";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  projectSlice,
  selectCurrentCaseId,
  selectIsEditable,
} from "#/store/reducers/projectReducer";

type TestCaseBrief = Pick<PlaygroundTestCase, "id" | "title">;

type TestCaseSelectBarProps = {
  selectedProject: UseQueryResult<RouterOutputs["project"]["getById"]>;
};

export const TestCaseSelectBar: React.FC<TestCaseSelectBarProps> = ({
  selectedProject,
}) => {
  const dispatch = useAppDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedCaseId = useAppSelector(selectCurrentCaseId);
  const selectedProjectId = selectedProject.data?.id;

  const trpcUtils = trpc.useContext();
  const addCase = trpc.project.addCase.useMutation({
    onSuccess: async (data, variables) => {
      await trpcUtils.project.getById.invalidate(variables.projectId);
      await trpcUtils.project.getCaseById.invalidate({
        id: data.id,
        projectId: variables.projectId,
      });
      dispatch(projectSlice.actions.update({ currentCaseId: data.id }));
      enqueueSnackbar(`🧪 Test case "${data.title}" created successfully! 🎉`, {
        variant: "success",
      });
    },
  });
  const deleteCase = trpc.project.deleteCase.useMutation({
    onSuccess: async (data, variables) => {
      if (selectedCaseId === data.id) {
        const firstCaseId = selectedProject.data?.cases[0]?.id;
        dispatch(
          projectSlice.actions.update({ currentCaseId: firstCaseId || null })
        );
      }

      await trpcUtils.project.getById.invalidate(variables.projectId);
      await trpcUtils.project.getCaseById.invalidate({
        id: variables.caseId,
        projectId: variables.projectId,
      });
    },
  });

  const cases = selectedProject.data?.cases;
  const isLoading =
    selectedProject.isLoading || addCase.isLoading || deleteCase.isLoading;

  const isEditable = useAppSelector(selectIsEditable);

  useEffect(() => {
    if (selectedCaseId || !selectedProject.data) return;

    const firstCaseId = selectedProject.data.cases[0]?.id;

    firstCaseId &&
      dispatch(projectSlice.actions.update({ currentCaseId: firstCaseId }));
  }, [selectedCaseId, selectedProject.data, dispatch]);

  const handleCaseClick = (testCase: TestCaseBrief) => {
    dispatch(projectSlice.actions.update({ currentCaseId: testCase.id }));
  };

  const handleCaseEdit = (testCase: TestCaseBrief) => {
    handleCaseClick(testCase);
    setIsModalOpen(true);
  };

  const handleAddCase = () => {
    if (!selectedProjectId) return;

    addCase.mutate({
      projectId: selectedProjectId,
      title: `Case ${(cases?.length ?? 0) + 1}`,
      input: "[]",
    });
  };

  return (
    <>
      <CaseModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {!selectedProject.data && (
          <>
            <SelectBarChipSkeleton width={112} />
            <SelectBarChipSkeleton width={42} />
            <SelectBarChipSkeleton />
            <SelectBarChipSkeleton width={24} />
          </>
        )}

        {cases?.map((testCase) => {
          const isCurrent = testCase.id === selectedCaseId;

          return (
            <SelectBarChip
              key={testCase.id}
              editLabel="Edit test case"
              isCurrent={isCurrent}
              isEditable={isEditable}
              label={testCase.title}
              disabled={isLoading}
              onClick={() => handleCaseClick(testCase)}
              onEditClick={() => handleCaseEdit(testCase)}
            />
          );
        })}

        {isEditable && (
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
        )}
      </Stack>
    </>
  );
};
