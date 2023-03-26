import {
  CircularProgress,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { z } from "zod";

type BinaryTreeInputProps = Omit<TextFieldProps, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

const inputValidator = z.array(z.null().or(z.number()));

export const BinaryTreeInput: React.FC<BinaryTreeInputProps> = ({
  value,
  onChange,
  ...restProps
}) => {
  const [rawInput, setRawInput] = useState<string>(value);
  const [inputError, setInputError] = useState<string | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);

  useEffect(() => {
    setRawInput(value);
  }, [value]);

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
    } catch (e: unknown) {
      if (e instanceof Error) {
        setInputError(e.message);
      } else {
        setInputError("Unknown error");
        console.error(e);
      }
    }
  }, [setInputError, rawInput]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasPendingChanges(false);
      if (inputError || rawInput === value) return;

      onChange(rawInput);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputError, onChange, rawInput, value]);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setRawInput(ev.target.value);
    setHasPendingChanges(true);
  };

  return (
    <TextField
      label="Binary Tree (input array)"
      placeholder="e.g.: [1,2,3,null,5]"
      value={rawInput}
      onChange={handleChange}
      error={!!inputError}
      helperText={inputError}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {hasPendingChanges && <CircularProgress size={24} />}
          </InputAdornment>
        ),
      }}
      {...restProps}
    />
  );
};
