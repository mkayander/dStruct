"use client";

import { Stack, TextField, Typography } from "@mui/material";
import Joi from "joi";
import React from "react";

import { getArgumentDisplayLabel } from "#/entities/argument/lib";
import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { argumentTypeLabels } from "#/entities/argument/model/argumentTypeLabels";
import { caseSlice } from "#/entities/argument/model/caseSlice";
import type { ArgumentObject } from "#/entities/argument/model/types";
import { argumentRenameEndAdornment } from "#/features/argsEditor/ui/ArgumentRenameSuffix";
import { BooleanToggleInput } from "#/shared/ui/atoms/BooleanToggleInput";
import { DebouncedInput } from "#/shared/ui/molecules/DebouncedInput";
import { JsonInput } from "#/shared/ui/molecules/JsonInput";
import { useAppDispatch } from "#/store/hooks";

const validationSchemaMap = {
  [ArgumentType.ARRAY]: Joi.array(),
  [ArgumentType.BINARY_TREE]: Joi.array().items(
    Joi.number().strict().allow(null),
  ),
  [ArgumentType.LINKED_LIST]: Joi.array().items(Joi.number()),
  [ArgumentType.MATRIX]: Joi.array().items(
    Joi.array().items(Joi.number().strict(), Joi.string()).messages({
      "array.includes":
        "Array item at {{#label}} must be either a number or a string",
    }),
    Joi.string(),
  ),
  [ArgumentType.GRAPH]: Joi.array().items(
    Joi.array().items(Joi.number().strict()),
  ),
} as const;

export const ArgInput: React.FC<{ arg: ArgumentObject }> = ({ arg }) => {
  const dispatch = useAppDispatch();
  const inputLabel = `${getArgumentDisplayLabel(arg)} (${argumentTypeLabels[arg.type]})`;
  const renameSuffix = argumentRenameEndAdornment(arg.name, arg.label ?? "");

  const handleChange = (value: string) => {
    dispatch(
      caseSlice.actions.updateArgument({
        ...arg,
        input: value,
      }),
    );
  };

  switch (arg.type) {
    case ArgumentType.ARRAY:
    case ArgumentType.BINARY_TREE:
    case ArgumentType.LINKED_LIST:
    case ArgumentType.MATRIX:
    case ArgumentType.GRAPH:
      return (
        <JsonInput
          label={inputLabel}
          value={arg.input}
          onChange={handleChange}
          validationSchema={validationSchemaMap[arg.type]}
          size="small"
          suffixSlot={renameSuffix}
          timeout={300}
        />
      );

    case ArgumentType.STRING:
      return (
        <DebouncedInput
          label={inputLabel}
          fullWidth
          size="small"
          onChange={handleChange}
          value={arg.input}
          timeout={300}
          InputProps={{ endAdornment: renameSuffix }}
        />
      );

    case ArgumentType.BOOLEAN:
      return (
        <Stack spacing={0.5} sx={{ width: "100%" }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="caption" color="text.secondary">
              {inputLabel}
            </Typography>
            {renameSuffix}
          </Stack>
          <BooleanToggleInput value={arg.input} onChange={handleChange} />
        </Stack>
      );
  }

  return (
    <TextField
      label={inputLabel}
      value={arg.input}
      type={arg.type === ArgumentType.NUMBER ? "number" : "text"}
      fullWidth
      size="small"
      onChange={(ev) => handleChange(ev.target.value)}
      InputProps={{ endAdornment: renameSuffix }}
    />
  );
};
