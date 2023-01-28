import { Add } from "@mui/icons-material";
import { CircularProgress, IconButton, Stack } from "@mui/material";
import type { PlaygroundTestCase } from "@prisma/client";
import type { UseQueryResult } from "@tanstack/react-query";
import React, { useEffect } from "react";

import { SelectBarChip } from "#/components/SelectBarChip";
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
  const selectedCaseId = useAppSelector(selectCurrentCaseId);
  const selectedProjectId = selectedProject.data?.id;

  const dispatch = useAppDispatch();

  const trpcUtils = trpc.useContext();
  const addCase = trpc.project.addCase.useMutation({
    onSuccess: async (data, variables) => {
      await trpcUtils.project.getById.invalidate(variables.projectId);
      await trpcUtils.project.getCaseById.invalidate({
        id: data.id,
        projectId: variables.projectId,
      });
      dispatch(projectSlice.actions.update({ currentCaseId: data.id }));
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
    // dispatch(projectSlice.actions.setCurrentCase(testCase));
  };

  const handleCaseDelete = (testCase: TestCaseBrief) => {
    if (!selectedProjectId) return;

    deleteCase.mutate({ projectId: selectedProjectId, caseId: testCase.id });
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
    <Stack direction="row" flexWrap="wrap" gap={1}>
      {cases?.map((testCase) => {
        const isCurrent = testCase.id === selectedCaseId;

        return (
          <SelectBarChip
            key={testCase.id}
            isCurrent={isCurrent}
            isEditable={isEditable}
            label={testCase.title}
            disabled={isLoading}
            onClick={() => handleCaseClick(testCase)}
            onDelete={() => {
              confirm(
                `Are you sure you want to delete "${testCase.title}"? This action cannot be undone.`
              ) && handleCaseDelete(testCase); // TODO: use a modal instead of prompt
            }}
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
  );
};
