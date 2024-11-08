"use client";

import { TextField } from "@mui/material";
import Joi from "joi";
import React, { useEffect, useState } from "react";

import { BooleanToggleInput } from "#/components/molecules/ArgsEditor/BooleanToggleInput";
import { DebouncedInput } from "#/components/molecules/ArgsEditor/DebouncedInput";
import { JsonInput } from "#/components/molecules/ArgsEditor/JsonInput";
import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { argumentTypeLabels } from "#/entities/argument/model/argumentTypeLabels";
import type { ArgumentObject } from "#/entities/argument/model/types";
import { useAppDispatch } from "#/store/hooks";
import { caseSlice } from "#/store/reducers/caseReducer";

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

  const [input, setInput] = useState<string>(arg.input);

  useEffect(() => {
    setInput(arg.input);
  }, [arg.input]);

  useEffect(() => {
    if (arg.input === input) return;

    dispatch(
      caseSlice.actions.updateArgument({
        ...arg,
        input: input,
      }),
    );
  }, [arg, dispatch, input]);

  switch (arg.type) {
    case ArgumentType.ARRAY:
    case ArgumentType.BINARY_TREE:
    case ArgumentType.LINKED_LIST:
    case ArgumentType.MATRIX:
    case ArgumentType.GRAPH:
      return (
        <JsonInput
          label={argumentTypeLabels[arg.type]}
          value={input}
          onChange={setInput}
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
          onChange={setInput}
          value={input}
        />
      );

    case ArgumentType.BOOLEAN:
      return <BooleanToggleInput value={input} onChange={setInput} />;
  }

  return (
    <TextField
      label={argumentTypeLabels[arg.type]}
      value={input}
      type={arg.type === ArgumentType.NUMBER ? "number" : "text"}
      fullWidth
      size="small"
      onChange={(ev) => setInput(ev.target.value)}
    />
  );
};
