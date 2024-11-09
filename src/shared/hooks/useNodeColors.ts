import { useTheme } from "@mui/material";

import { getNodeColors } from "#/shared/lib";

export const useNodeColors = (
  color?: string | null,
  useDefaultPrimary = true,
) => {
  const theme = useTheme();

  return getNodeColors(theme, color, useDefaultPrimary);
};
