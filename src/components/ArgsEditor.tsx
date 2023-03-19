import { Add } from "@mui/icons-material";
import { Box, IconButton, Stack } from "@mui/material";
import { type UseQueryResult } from "@tanstack/react-query";
import React, { useEffect } from "react";

import { BinaryTreeInput } from "#/components/BinaryTreeInput";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  type ArgumentObject,
  ArgumentType,
  caseSlice,
  isArgumentObjectValid,
  selectCaseArguments,
} from "#/store/reducers/caseReducer";
import { type RouterOutputs } from "#/utils/trpc";

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
  const args = useAppSelector(selectCaseArguments);

  // const updateCase = trpc.project.updateCase.useMutation();

  useEffect(() => {
    if (!selectedCase.data) return;
    if (!isArgumentObjectValid(selectedCase.data.args)) {
      console.log("Invalid arguments object", selectedCase.data.args);
      return;
    }
    if (args.length > 0) return;

    dispatch(
      caseSlice.actions.setArguments(Object.values(selectedCase.data.args))
    );
  });

  const handleAddArg = () => {
    dispatch(
      caseSlice.actions.addArgument({
        name: `binary-tree-${Math.floor(Math.random() * 1000)}`,
        type: ArgumentType.BINARY_TREE,
        order: 0,
        input: "[]",
      })
    );
  };

  return (
    <Stack mt={1}>
      {args.map((arg) => (
        <ArgInput key={arg.name} arg={arg} />
      ))}
      <Box display="flex" justifyContent="center">
        <IconButton title="Add argument" onClick={handleAddArg}>
          <Add />
        </IconButton>
      </Box>
    </Stack>
  );
};
