import { Add, DeleteForever } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type UseQueryResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import { ArgumentTypeSelect } from "#/components/ArgumentTypeSelect";
import { BinaryTreeInput } from "#/components/BinaryTreeInput";
import { usePlaygroundSlugs, usePrevious } from "#/hooks";
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
  argumentTypeLabels,
  isArgumentObjectValid,
} from "#/utils/argumentObject";
import { type RouterOutputs, trpc } from "#/utils/trpc";

type ArgsEditorProps = {
  selectedCase: UseQueryResult<RouterOutputs["project"]["getCaseBySlug"]>;
};

const ArgInput: React.FC<{ arg: ArgumentObject }> = ({ arg }) => {
  const dispatch = useAppDispatch();

  const [input, setInput] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);

  useEffect(() => {
    setInput(arg.input);
  }, [arg.input]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasPendingChanges(false);
      if (inputError || arg.input === input) return;

      dispatch(
        caseSlice.actions.updateArgument({
          ...arg,
          input,
        })
      );
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [arg, dispatch, inputError, input]);

  if (arg.type === ArgumentType.BINARY_TREE) {
    return (
      <BinaryTreeInput
        value={input}
        onChange={(event) => setInput(event.target.value)}
        errorText={inputError}
        setInputError={setInputError}
        hasPendingChanges={hasPendingChanges}
        setHasPendingChanges={setHasPendingChanges}
      />
    );
  }

  return (
    <TextField
      label={argumentTypeLabels[arg.type]}
      value={input}
      fullWidth
      onChange={(ev) => setInput(ev.target.value)}
    />
  );
};

export const ArgsEditor: React.FC<ArgsEditorProps> = ({ selectedCase }) => {
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

  const handleArgTypeChange = (arg: ArgumentObject, type: ArgumentType) => {
    dispatch(caseSlice.actions.updateArgument({ ...arg, type, input: "" }));
  };

  const isLoading = selectedCase.isLoading || updateCase.isLoading;

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mt={1} mb={2}>
        <Typography variant="caption">Arguments</Typography>
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
                  title={`Delete ${arg.name} argument`}
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
              title="Add argument"
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
