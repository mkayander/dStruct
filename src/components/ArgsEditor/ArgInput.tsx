import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import * as yup from "yup";

import { BooleanToggleInput } from "#/components/ArgsEditor/BooleanToggleInput";
import { JsonInput } from "#/components/ArgsEditor/JsonInput";
import { useAppDispatch } from "#/store/hooks";
import { caseSlice } from "#/store/reducers/caseReducer";
import {
  type ArgumentObject,
  ArgumentType,
  argumentTypeLabels,
} from "#/utils/argumentObject";

const validationSchemaMap = {
  [ArgumentType.ARRAY]: yup
    .array()
    .typeError((params) => `This must be an array, but got ${params.value}`),
  [ArgumentType.BINARY_TREE]: yup.array().of(yup.number().nullable()),
  [ArgumentType.MATRIX]: yup.array().of(yup.array().of(yup.number())),
} as const;

const labelMap = {
  [ArgumentType.ARRAY]: "Array",
  [ArgumentType.BINARY_TREE]: "Binary Tree",
  [ArgumentType.MATRIX]: "Matrix",
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
      })
    );
  }, [arg, dispatch, input]);

  switch (arg.type) {
    case ArgumentType.ARRAY:
    case ArgumentType.BINARY_TREE:
    case ArgumentType.MATRIX:
      return (
        <JsonInput
          label={labelMap[arg.type]}
          value={input}
          onChange={setInput}
          validationSchema={validationSchemaMap[arg.type]}
        />
      );
  }

  if (arg.type === ArgumentType.BOOLEAN) {
    return <BooleanToggleInput value={input} onChange={setInput} />;
  }

  return (
    <TextField
      label={argumentTypeLabels[arg.type]}
      value={input}
      type={arg.type === ArgumentType.NUMBER ? "number" : "text"}
      fullWidth
      onChange={(ev) => setInput(ev.target.value)}
    />
  );
};
