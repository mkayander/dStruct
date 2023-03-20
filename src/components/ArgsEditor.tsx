import { Add, DeleteForever } from "@mui/icons-material";
import { Box, IconButton, LinearProgress, Stack } from "@mui/material";
import { type UseQueryResult } from "@tanstack/react-query";
import React, { useEffect } from "react";

import { BinaryTreeInput } from "#/components/BinaryTreeInput";
import { usePlaygroundSlugs } from "#/hooks";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  type ArgumentObject,
  type ArgumentObjectMap,
  ArgumentType,
  caseSlice,
  isArgumentObjectValid,
  selectCaseArguments,
  selectCaseIsEdited,
} from "#/store/reducers/caseReducer";
import { selectIsEditable } from "#/store/reducers/projectReducer";
import { type RouterOutputs, trpc } from "#/utils/trpc";

type ArgsEditorProps = {
  selectedCase: UseQueryResult<RouterOutputs["project"]["getCaseBySlug"]>;
};

const ArgInput: React.FC<{ arg: ArgumentObject }> = ({ arg }) => {
  if (arg.type === ArgumentType.BINARY_TREE) {
    return <BinaryTreeInput arg={arg} />;
  }

  return (
    <div>
      {arg.name} {arg.type}
    </div>
  );
};

export const ArgsEditor: React.FC<ArgsEditorProps> = ({ selectedCase }) => {
  const dispatch = useAppDispatch();
  const { caseSlug } = usePlaygroundSlugs();
  const args = useAppSelector(selectCaseArguments);
  const isEditable = useAppSelector(selectIsEditable);
  const isCaseEdited = useAppSelector(selectCaseIsEdited);

  const trpcUtils = trpc.useContext();

  const updateCase = trpc.project.updateCase.useMutation({
    onSuccess: async (data) => {
      if (!selectedCase.data) return;
      const input = {
        projectId: selectedCase.data.projectId,
        slug: selectedCase.data.slug,
      };
      trpcUtils.project.getCaseBySlug.setData(input, data);
    },
  });

  useEffect(() => {
    if (
      caseSlug &&
      selectedCase.data?.args &&
      isArgumentObjectValid(selectedCase.data.args)
    ) {
      dispatch(
        caseSlice.actions.setArguments(Object.values(selectedCase.data.args))
      );
    } else {
      dispatch(caseSlice.actions.clear());
    }
  }, [caseSlug, dispatch, selectedCase.data?.args]);

  useEffect(() => {
    if (!selectedCase.data || !isCaseEdited) return;

    const timeoutId = setTimeout(() => {
      updateCase.mutate({
        projectId: selectedCase.data.projectId,
        caseId: selectedCase.data.id,
        args: args.reduce<ArgumentObjectMap>((acc, arg) => {
          acc[arg.name] = arg;
          return acc;
        }, {}),
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args]);

  const handleAddArg = () => {
    dispatch(
      caseSlice.actions.addArgument({
        name: `binary-tree-${Math.floor(Math.random() * 1000)}`,
        type: ArgumentType.BINARY_TREE,
        order: args.length,
        input: "[]",
      })
    );
  };

  const handleDeleteArg = (arg: ArgumentObject) => {
    dispatch(caseSlice.actions.removeArgument(arg));
  };

  return (
    <Box>
      <LinearProgress
        sx={{
          mb: 2,
          opacity: selectedCase.isLoading || updateCase.isLoading ? 1 : 0,
          transition: "opacity .2s",
        }}
      />
      <Stack mt={1} spacing={2}>
        {args.map((arg) => (
          <Stack
            key={arg.name}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <ArgInput arg={arg} />
            <IconButton
              title={`Delete ${arg.name} argument`}
              onClick={() => handleDeleteArg(arg)}
              size="small"
            >
              <DeleteForever fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        {isEditable && caseSlug && (
          <Box display="flex" justifyContent="center">
            <IconButton title="Add argument" onClick={handleAddArg}>
              <Add />
            </IconButton>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
