import { FormControlLabel, Switch, type SwitchProps } from "@mui/material";
import React from "react";

type BooleanToggleInputProps = Omit<SwitchProps, "value" | "onChange"> & {
  value: string;
  onChange(value: string): void;
};

export const BooleanToggleInput: React.FC<BooleanToggleInputProps> = ({
  value,
  onChange,
  ...restProps
}) => {
  const handleChange: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = (ev) => {
    onChange(ev.target.checked ? "true" : "false");
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={value === "true"}
          onChange={handleChange}
          size="small"
          {...restProps}
        />
      }
      label={value === "true" ? "True" : "False"}
      labelPlacement="end"
      sx={{ ml: 1 }}
    />
  );
};
