"use client";

import {
  CircularProgress,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import React, { useEffect, useState } from "react";

type DebouncedInputProps = Omit<TextFieldProps, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  timeout?: number;
};

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value,
  onChange,
  timeout,
  ...restProps
}) => {
  const [rawInput, setRawInput] = useState<string>(value);
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);

  useEffect(() => {
    setRawInput(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHasPendingChanges(false);
      if (rawInput === value) return;

      onChange(rawInput);
    }, timeout ?? 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onChange, rawInput, restProps.error, timeout, value]);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setRawInput(ev.target.value);
    setHasPendingChanges(true);
  };

  return (
    <TextField
      value={rawInput}
      onChange={handleChange}
      InputProps={{
        endAdornment: hasPendingChanges ? (
          <InputAdornment position="end">
            <CircularProgress size={24} />
          </InputAdornment>
        ) : null,
      }}
      {...restProps}
    />
  );
};
