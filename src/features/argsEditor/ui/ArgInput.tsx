"use client";

import { TextField } from "@mui/material";
import Joi from "joi";
import React from "react";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { argumentTypeLabels } from "#/entities/argument/model/argumentTypeLabels";
import { caseSlice } from "#/entities/argument/model/caseSlice";
import type { ArgumentObject } from "#/entities/argument/model/types";
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
          label={argumentTypeLabels[arg.type]}
          value={arg.input}
          onChange={handleChange}
          validationSchema={validationSchemaMap[arg.type]}
          size="small"
        />
      );

    case ArgumentType.STRING:
      return (
        <DebouncedInput
          label={argumentTypeLabels.string}
          fullWidth
          size="small"
          onChange={handleChange}
          value={arg.input}
        />
      );

    case ArgumentType.BOOLEAN:
      return <BooleanToggleInput value={arg.input} onChange={handleChange} />;
  }

  return (
    <TextField
      label={argumentTypeLabels[arg.type]}
      value={arg.input}
      type={arg.type === ArgumentType.NUMBER ? "number" : "text"}
      fullWidth
      size="small"
      onChange={(ev) => handleChange(ev.target.value)}
    />
  );
};
