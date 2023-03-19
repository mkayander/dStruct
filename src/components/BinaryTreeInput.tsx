import { TextField, type TextFieldProps } from "@mui/material";
import React, { useEffect, useState } from "react";

import { useAppDispatch } from "#/store/hooks";
import { type ArgumentObject, caseSlice } from "#/store/reducers/caseReducer";

type BinaryTreeInputProps = TextFieldProps & {
  arg: ArgumentObject;
};

export const BinaryTreeInput: React.FC<BinaryTreeInputProps> = ({
  arg,
  ...restProps
}) => {
  const dispatch = useAppDispatch();
  const [rawInput, setRawInput] = useState<string>("[]");
  const [inputError, setInputError] = useState<string | null>(null);

  useEffect(() => {
    if (!rawInput) {
      setInputError(null);
    }

    try {
      const parsed = JSON.parse(rawInput);
      if (Array.isArray(parsed)) {
        setInputError(null);
      } else {
        setInputError(`Input must be an array, but got ${typeof parsed}`);
      }
    } catch (e: any) {
      setInputError(e.message);
    }
  }, [rawInput]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputError) return;

      dispatch(
        caseSlice.actions.updateArgument({
          ...arg,
          input: rawInput,
        })
      );
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [arg, dispatch, inputError, rawInput]);

  return (
    <TextField
      label="Input array"
      placeholder="e.g.: [1,2,3,null,5]"
      value={rawInput}
      onChange={(ev) => setRawInput(ev.target.value)}
      error={!!inputError}
      helperText={inputError || "Must be a JSON array of numbers"}
      fullWidth
      {...restProps}
    />
  );
};
