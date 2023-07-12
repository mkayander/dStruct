"use client";

import { type TextFieldProps } from "@mui/material";
import Joi from "joi";
import React, { useState } from "react";

import { DebouncedInput } from "#/components/ArgsEditor/DebouncedInput";
import { useI18nContext } from "#/i18n/i18n-react";

type BinaryTreeInputProps = Omit<TextFieldProps, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  validationSchema: Joi.Schema;
};

export const JsonInput: React.FC<BinaryTreeInputProps> = ({
  onChange,
  validationSchema,
  ...restProps
}) => {
  const { LL } = useI18nContext();
  const [inputError, setInputError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    onChange(value);

    if (!value) {
      setInputError(null);
    }

    try {
      const parsed = JSON.parse(value);
      Joi.assert(parsed, validationSchema);
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
      label={LL.INPUT()}
      placeholder="e.g.: [1,2,3,null,5]"
      onChange={handleChange}
      error={!!inputError}
      helperText={inputError}
      fullWidth
      {...restProps}
    />
  );
};
