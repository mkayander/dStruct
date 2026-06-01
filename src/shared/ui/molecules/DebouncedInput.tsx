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
  slotProps,
  inputRef,
  ...restProps
}) => {
  const [rawInput, setRawInput] = useState<string>(value);
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);
  const [syncedExternalValue, setSyncedExternalValue] = useState(value);

  if (value !== syncedExternalValue) {
    setSyncedExternalValue(value);
    if (!hasPendingChanges) {
      setRawInput(value);
    }
  }

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

  const inputSlotProps = slotProps?.input;
  const endAdornment =
    typeof inputSlotProps === "object" &&
    inputSlotProps !== null &&
    "endAdornment" in inputSlotProps
      ? inputSlotProps.endAdornment
      : null;

  return (
    <TextField
      value={rawInput}
      onChange={handleChange}
      inputRef={inputRef}
      slotProps={{
        ...slotProps,
        input: {
          ...(typeof inputSlotProps === "object" && inputSlotProps !== null
            ? inputSlotProps
            : {}),
          endAdornment: hasPendingChanges ? (
            <InputAdornment position="end">
              <CircularProgress size={24} />
            </InputAdornment>
          ) : (
            endAdornment
          ),
        },
      }}
      {...restProps}
    />
  );
};
