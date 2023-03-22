import {
  AccountTree,
  DataArray,
  LooksOne,
  RadioButtonChecked,
  TextFields,
} from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
  type SxProps,
} from "@mui/material";
import React from "react";

import { ArgumentType, argumentTypeLabels } from "#/utils/argumentObject";

type ArgumentTypeSelectProps = Omit<SelectProps, "value" | "onChange"> & {
  value: ArgumentType;
  onChange: (value: ArgumentType) => void;
};

const iconSxProps: SxProps = {
  fontSize: "17px",
  verticalAlign: "text-bottom",
  mr: 1,
  mb: "2px",
};

const typeIconsMap = {
  [ArgumentType.BINARY_TREE]: <AccountTree sx={iconSxProps} />,
  [ArgumentType.NUMBER]: <LooksOne sx={iconSxProps} />,
  [ArgumentType.ARRAY]: <DataArray sx={iconSxProps} />,
  [ArgumentType.BOOLEAN]: <RadioButtonChecked sx={iconSxProps} />,
  [ArgumentType.STRING]: <TextFields sx={iconSxProps} />,
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
        sx={{
          width: "70px",
          "& [role=button]": {
            color: "transparent",
            "& > svg": {
              ml: 0.5,
              color: "white",
            },
          },
        }}
        {...restProps}
      >
        {Object.values(ArgumentType).map((type) => (
          <MenuItem key={type} value={type}>
            {typeIconsMap[type]} {argumentTypeLabels[type]}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText></FormHelperText>
    </FormControl>
  );
};
