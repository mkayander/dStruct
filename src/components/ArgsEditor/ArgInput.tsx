import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import * as yup from "yup";

import { BooleanToggleInput } from "#/components/ArgsEditor/BooleanToggleInput";
import { DebouncedInput } from "#/components/ArgsEditor/DebouncedInput";
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
  [ArgumentType.LINKED_LIST]: yup.array().of(yup.number()),
  [ArgumentType.MATRIX]: yup.array().of(yup.array().of(yup.number())),
  [ArgumentType.GRAPH]: yup.array().of(yup.array().of(yup.number())),
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
    case ArgumentType.LINKED_LIST:
    case ArgumentType.MATRIX:
    case ArgumentType.GRAPH:
      return (
        <JsonInput
          label={argumentTypeLabels[arg.type]}
          value={input}
          onChange={setInput}
          validationSchema={validationSchemaMap[arg.type]}
        />
      );

    case ArgumentType.STRING:
      return <DebouncedInput fullWidth onChange={setInput} value={input} />;

    case ArgumentType.BOOLEAN:
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
