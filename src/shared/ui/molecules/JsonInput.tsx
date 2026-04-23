"use client";

import { type TextFieldProps } from "@mui/material";
import Joi from "joi";
import React, { useState } from "react";

import { useI18nContext } from "#/shared/hooks";
import { DebouncedInput } from "#/shared/ui/molecules/DebouncedInput";

type JsonInputProps = Omit<TextFieldProps, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  validationSchema: Joi.Schema;
  /** Debounce for persisting JSON text (passed to `DebouncedInput`). */
  timeout?: number;
  /** Rendered inside `InputProps.endAdornment` before any inherited adornment (e.g. rename control). */
  suffixSlot?: React.ReactNode;
};

export const JsonInput: React.FC<JsonInputProps> = ({
  onChange,
  validationSchema,
  timeout,
  suffixSlot,
  InputProps,
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setInputError(error.message);
      } else {
        setInputError("Unknown error");
        console.error(error);
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
      timeout={timeout}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <>
            {suffixSlot}
            {InputProps?.endAdornment}
          </>
        ),
      }}
      {...restProps}
    />
  );
};
