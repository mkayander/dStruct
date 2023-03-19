import { TextField, type TextFieldProps } from "@mui/material";
import React, { useEffect, useState } from "react";
import { z } from "zod";

import { useAppDispatch } from "#/store/hooks";
import { type ArgumentObject, caseSlice } from "#/store/reducers/caseReducer";

type BinaryTreeInputProps = TextFieldProps & {
  arg: ArgumentObject;
};

const inputValidator = z.array(z.null().or(z.number()));

export const BinaryTreeInput: React.FC<BinaryTreeInputProps> = ({
  arg,
  ...restProps
}) => {
  const dispatch = useAppDispatch();
  const [rawInput, setRawInput] = useState<string>("");
  const [inputError, setInputError] = useState<string | null>(null);

  useEffect(() => {
    setRawInput(arg.input);
  }, [arg.input]);

  useEffect(() => {
    if (!rawInput) {
      setInputError(null);
    }

    try {
      const parsed = JSON.parse(rawInput);
      if (Array.isArray(parsed)) {
        if (!inputValidator.safeParse(parsed).success) {
          setInputError("Input must be an array of numbers or nulls");
          return;
        }

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
      if (inputError || arg.input === rawInput) return;

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
      label="Binary Tree (input array)"
      placeholder="e.g.: [1,2,3,null,5]"
      value={rawInput}
      onChange={(ev) => setRawInput(ev.target.value)}
      error={!!inputError}
      helperText={inputError}
      fullWidth
      {...restProps}
    />
  );
};
