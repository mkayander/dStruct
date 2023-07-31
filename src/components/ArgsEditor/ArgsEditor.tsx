"use client";

import { Add, DeleteForever } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { type UseQueryResult } from "@tanstack/react-query";
import React, { useEffect } from "react";
import shortUUID from "short-uuid";

import { ArgInput, ArgumentTypeSelect } from "#/components";
import { usePlaygroundSlugs, usePrevious } from "#/hooks";
import { useI18nContext } from "#/hooks";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  caseSlice,
  selectCaseArguments,
  selectCaseIsEdited,
} from "#/store/reducers/caseReducer";
import { selectIsEditable } from "#/store/reducers/projectReducer";
import {
  type ArgumentObject,
  type ArgumentObjectMap,
  ArgumentType,
  isArgumentObjectValid,
} from "#/utils/argumentObject";
import { type RouterOutputs, trpc } from "#/utils/trpc";

const uuid = shortUUID();

type ArgsEditorProps = {
  selectedCase: UseQueryResult<RouterOutputs["project"]["getCaseBySlug"]>;
};

export const ArgsEditor: React.FC<ArgsEditorProps> = ({ selectedCase }) => {
  const { LL } = useI18nContext();
  const dispatch = useAppDispatch();
  const { caseSlug } = usePlaygroundSlugs();
  const prevCaseSlug = usePrevious(caseSlug);
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
        caseSlice.actions.setArguments({
          data: Object.values(selectedCase.data.args),
          resetInfoState: caseSlug !== prevCaseSlug,
        })
      );
    } else {
      dispatch(caseSlice.actions.clear());
    }
  }, [prevCaseSlug, caseSlug, dispatch, selectedCase.data?.args]);

  useEffect(() => {
    if (!isEditable || !selectedCase.data || !isCaseEdited) return;

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
        name: uuid.generate(),
        type: ArgumentType.BINARY_TREE,
        order: args.length,
        input: "[]",
      })
    );
  };

  const handleDeleteArg = (arg: ArgumentObject) => {
    dispatch(caseSlice.actions.removeArgument(arg));
  };

  const handleArgTypeChange = (arg: ArgumentObject, type: ArgumentType) => {
    dispatch(caseSlice.actions.updateArgument({ ...arg, type, input: "" }));
  };

  const isLoading = selectedCase.isLoading || updateCase.isLoading;

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mt={1} mb={2}>
        <Typography variant="caption">{LL.ARGUMENTS()}</Typography>
        {isLoading && <CircularProgress size={14} />}
        <Divider sx={{ flexGrow: 1 }} />
      </Stack>
      <Stack mt={1} spacing={2}>
        {args.map((arg) => (
          <Stack
            key={arg.name}
            direction="row"
            justifyContent="space-between"
            alignItems="start"
            spacing={1}
          >
            <ArgInput arg={arg} />
            {isEditable && (
              <Stack direction="row" spacing={1} alignItems="center">
                <ArgumentTypeSelect
                  value={arg.type}
                  onChange={(type) => handleArgTypeChange(arg, type)}
                />
                <IconButton
                  title={LL.DELETE_X_ARGUMENT({ name: arg.name })}
                  disabled={isLoading}
                  onClick={() => handleDeleteArg(arg)}
                  size="small"
                  sx={{ top: -2 }}
                >
                  <DeleteForever fontSize="small" />
                </IconButton>
              </Stack>
            )}
          </Stack>
        ))}
        {isEditable && caseSlug && (
          <Box display="flex" justifyContent="center">
            <IconButton
              title={LL.ADD_ARGUMENT()}
              disabled={isLoading}
              onClick={handleAddArg}
            >
              <Add />
            </IconButton>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
