"use client";

import { type TextFieldProps } from "@mui/material";
import React, { useState } from "react";
import type * as yup from "yup";

import { DebouncedInput } from "#/components/ArgsEditor/DebouncedInput";

type BinaryTreeInputProps = Omit<TextFieldProps, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  validationSchema: yup.BaseSchema;
};

export const JsonInput: React.FC<BinaryTreeInputProps> = ({
  onChange,
  validationSchema,
  ...restProps
}) => {
  const [inputError, setInputError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    onChange(value);

    if (!value) {
      setInputError(null);
    }

    try {
      const parsed = JSON.parse(value);
      validationSchema.validateSync(parsed, {
        strict: true,
      });
      setInputError(null);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setInputError(e.message);
      } else {
        setInputError("Unknown error");
        console.error(e);
      }
    }
  };

  return (
    <DebouncedInput
      label="Input"
      placeholder="e.g.: [1,2,3,null,5]"
      onChange={handleChange}
      error={!!inputError}
      helperText={inputError}
      fullWidth
      {...restProps}
    />
  );
};
