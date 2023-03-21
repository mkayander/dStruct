import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
} from "@mui/material";
import React from "react";

import { ArgumentType, argumentTypeLabels } from "#/utils/argumentObject";

type ArgumentTypeSelectProps = Omit<SelectProps, "value" | "onChange"> & {
  value: ArgumentType;
  onChange: (value: ArgumentType) => void;
};

export const ArgumentTypeSelect: React.FC<ArgumentTypeSelectProps> = ({
  value,
  onChange,
  ...restProps
}) => {
  return (
    <FormControl>
      <InputLabel>Type</InputLabel>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value as ArgumentType)}
        label="Type"
        sx={{ width: 86 }}
        {...restProps}
      >
        {Object.values(ArgumentType).map((type) => (
          <MenuItem key={type} value={type}>
            {argumentTypeLabels[type]}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText></FormHelperText>
    </FormControl>
  );
};
