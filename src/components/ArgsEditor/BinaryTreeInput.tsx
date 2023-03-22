import {
  CircularProgress,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import React, { useEffect } from "react";
import { z } from "zod";

type BinaryTreeInputProps = TextFieldProps & {
  value: string;
  errorText: string | null;
  setInputError: React.Dispatch<React.SetStateAction<string | null>>;
  hasPendingChanges?: boolean;
  setHasPendingChanges: React.Dispatch<React.SetStateAction<boolean>>;
};

const inputValidator = z.array(z.null().or(z.number()));

export const BinaryTreeInput: React.FC<BinaryTreeInputProps> = ({
  value,
  onChange,
  errorText,
  setInputError,
  hasPendingChanges,
  setHasPendingChanges,
  ...restProps
}) => {
  useEffect(() => {
    if (!value) {
      setInputError(null);
    }

    try {
      const parsed = JSON.parse(value);
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
  }, [setInputError, value]);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(ev);
    setHasPendingChanges(true);
  };

  return (
    <TextField
      label="Binary Tree (input array)"
      placeholder="e.g.: [1,2,3,null,5]"
      value={value}
      onChange={handleChange}
      error={!!errorText}
      helperText={errorText}
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
