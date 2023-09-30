import {
  AccountTree,
  DataArray,
  GridOn,
  Link,
  LooksOne,
  RadioButtonChecked,
  TextFields,
  Timeline,
} from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
  type SxProps,
  useTheme,
} from "@mui/material";
import React from "react";

import { useI18nContext } from "#/hooks";
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

const typeIconsMap: Record<ArgumentType, React.ReactElement> = {
  [ArgumentType.BINARY_TREE]: <AccountTree sx={iconSxProps} />,
  [ArgumentType.LINKED_LIST]: <Link sx={iconSxProps} />,
  [ArgumentType.GRAPH]: <Timeline sx={iconSxProps} />,
  [ArgumentType.NUMBER]: <LooksOne sx={iconSxProps} />,
  [ArgumentType.MATRIX]: <GridOn sx={iconSxProps} />,
  [ArgumentType.ARRAY]: <DataArray sx={iconSxProps} />,
  [ArgumentType.BOOLEAN]: <RadioButtonChecked sx={iconSxProps} />,
  [ArgumentType.STRING]: <TextFields sx={iconSxProps} />,
};

export const ArgumentTypeSelect: React.FC<ArgumentTypeSelectProps> = ({
  value,
  onChange,
  ...restProps
}) => {
  const { LL } = useI18nContext();
  const theme = useTheme();

  return (
    <FormControl>
      <InputLabel>{LL.TYPE()}</InputLabel>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value as ArgumentType)}
        label={LL.TYPE()}
        size="small"
        sx={{
          width: "70px",
          "& [role=button]": {
            color: "transparent",
            "& > svg": {
              ml: 0.5,
              color: theme.palette.text.primary,
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
