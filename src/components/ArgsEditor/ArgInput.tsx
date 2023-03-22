import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import { BinaryTreeInput } from "#/components/ArgsEditor/BinaryTreeInput";
import { useAppDispatch } from "#/store/hooks";
import { caseSlice } from "#/store/reducers/caseReducer";
import {
  type ArgumentObject,
  ArgumentType,
  argumentTypeLabels,
} from "#/utils/argumentObject";

export const ArgInput: React.FC<{ arg: ArgumentObject }> = ({ arg }) => {
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
