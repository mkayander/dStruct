"use client";

import { type OnDragEndResponder } from "@hello-pangea/dnd";
import { DeleteForever, DragIndicator } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { type UseQueryResult } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import shortUUID from "short-uuid";

import { isArgumentObjectValid } from "#/entities/argument/lib";
import { ArgumentType } from "#/entities/argument/model/argumentObject";
import {
  caseSlice,
  selectCaseArguments,
  selectCaseIsEdited,
} from "#/entities/argument/model/caseSlice";
import type {
  ArgumentObject,
  ArgumentObjectMap,
} from "#/entities/argument/model/types";
import { AddArgumentButton } from "#/features/argsEditor/ui/AddArgumentButton";
import { ArgInput } from "#/features/argsEditor/ui/ArgInput";
import { ArgumentTypeSelect } from "#/features/argsEditor/ui/ArgumentTypeSelect";
import { DraggableArgsList } from "#/features/argsEditor/ui/DraggableArgsList";
import { DraggableItem } from "#/features/argsEditor/ui/DraggableItem";
import { selectIsEditable } from "#/features/project/model/projectSlice";
import { editorSlice } from "#/features/treeViewer/model/editorSlice";
import { usePlaygroundSlugs } from "#/shared/hooks";
import { useI18nContext } from "#/shared/hooks";
import { usePrevious } from "#/shared/hooks";
import { type RouterOutputs, trpc } from "#/shared/lib/trpc";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

const uuid = shortUUID();

type ArgsEditorProps = {
  selectedCase: UseQueryResult<RouterOutputs["project"]["getCaseBySlug"]>;
};

export const ArgsEditor: React.FC<ArgsEditorProps> = ({ selectedCase }) => {
  const { LL } = useI18nContext();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { caseSlug } = usePlaygroundSlugs();
  const prevCaseSlug = usePrevious(caseSlug);
  const args = useAppSelector(selectCaseArguments);
  const isEditable = useAppSelector(selectIsEditable);
  const isCaseEdited = useAppSelector(selectCaseIsEdited);

  const trpcUtils = trpc.useUtils();

  const updateCase = trpc.project.updateCase.useMutation();

  useEffect(() => {
    if (
      caseSlug &&
      selectedCase.data?.args &&
      isArgumentObjectValid(selectedCase.data.args)
    ) {
      dispatch(
        caseSlice.actions.setArguments({
          projectId: selectedCase.data.projectId,
          caseId: selectedCase.data.id,
          data: Object.values(selectedCase.data.args),
          resetInfoState: caseSlug !== prevCaseSlug,
        }),
      );
      dispatch(editorSlice.actions.reset());
    } else {
      dispatch(caseSlice.actions.clear());
    }
  }, [
    prevCaseSlug,
    caseSlug,
    dispatch,
    selectedCase.data?.projectId,
    selectedCase.data?.id,
    selectedCase.data?.args,
  ]);

  useEffect(() => {
    if (!isEditable || !selectedCase.data || !isCaseEdited) return;

    let isCancelled = false;
    const timeoutId = setTimeout(async () => {
      try {
        const data = await updateCase.mutateAsync({
          projectId: selectedCase.data.projectId,
          caseId: selectedCase.data.id,
          args: args.reduce<ArgumentObjectMap>((acc, arg) => {
            acc[arg.name] = arg;
            return acc;
          }, {}),
        });
        if (!isCancelled) {
          trpcUtils.project.getCaseBySlug.setData(
            { projectId: data.projectId, slug: data.slug },
            data,
          );
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          enqueueSnackbar(error.message, {
            variant: "error",
          });
        }
        console.error("Failed to update case arguments: ", error);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      isCancelled = true;
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
      }),
    );
  };

  const handleDeleteArg = (arg: ArgumentObject) => {
    dispatch(caseSlice.actions.removeArgument(arg));
  };

  const handleArgTypeChange = (arg: ArgumentObject, type: ArgumentType) => {
    dispatch(caseSlice.actions.updateArgument({ ...arg, type, input: "" }));
  };

  const handleDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination || result.destination.index === result.source.index)
      return;

    dispatch(
      caseSlice.actions.reorderArgument({
        oldIndex: result.source.index,
        newIndex: result.destination.index,
      }),
    );
  };

  const isLoading = selectedCase.isLoading || updateCase.isLoading;

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" mt={1} mb={2}>
        <Typography variant="caption">{LL.ARGUMENTS()}</Typography>
        {isLoading && <CircularProgress size={14} />}
        <Divider sx={{ flexGrow: 1 }} />
      </Stack>
      <DraggableArgsList
        onDragEnd={handleDragEnd}
        renderAddButton={() =>
          isEditable && caseSlug ? (
            <AddArgumentButton
              onClick={handleAddArg}
              title={LL.ADD_ARGUMENT()}
            />
          ) : null
        }
      >
        {args.map((arg, index) => (
          <DraggableItem
            key={arg.name}
            id={arg.name}
            index={index}
            isDragDisabled={!isEditable}
          >
            {(provided) => (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="start"
                spacing={1}
              >
                <Box display="flex" flexDirection="row" flexGrow={1}>
                  <Box
                    {...provided.dragHandleProps}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: "37px",
                      cursor: isEditable ? "grab" : "default",
                      opacity: isEditable ? 1 : 0.3,
                      "&:active": {
                        cursor: isEditable ? "grabbing" : "default",
                      },
                    }}
                  >
                    <DragIndicator
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                  </Box>
                  <ArgInput arg={arg} />
                </Box>
                {isEditable && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ArgumentTypeSelect
                      value={arg.type}
                      onChange={(type) => handleArgTypeChange(arg, type)}
                    />
                    <IconButton
                      title={LL.DELETE_X_ARGUMENT({ name: arg.name })}
                      onClick={() => handleDeleteArg(arg)}
                      size="small"
                      sx={{ top: -2 }}
                    >
                      <DeleteForever fontSize="small" />
                    </IconButton>
                  </Stack>
                )}
              </Stack>
            )}
          </DraggableItem>
        ))}
      </DraggableArgsList>
    </Box>
  );
};
