import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import { BinaryTreeInput } from "#/components/ArgsEditor/BinaryTreeInput";
import { BooleanToggleInput } from "#/components/ArgsEditor/BooleanToggleInput";
import { useAppDispatch } from "#/store/hooks";
import { caseSlice } from "#/store/reducers/caseReducer";
import {
  type ArgumentObject,
  ArgumentType,
  argumentTypeLabels,
} from "#/utils/argumentObject";

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

  if (arg.type === ArgumentType.BINARY_TREE) {
    return <BinaryTreeInput value={input} onChange={setInput} />;
  }

  if (arg.type === ArgumentType.BOOLEAN) {
    return <BooleanToggleInput value={input} onChange={setInput} />;
  }

  return (
    <TextField
      label={argumentTypeLabels[arg.type]}
      value={input}
      fullWidth
      onChange={(ev) => setInput(ev.target.value)}
    />
  );
};
