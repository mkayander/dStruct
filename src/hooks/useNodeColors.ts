import { useTheme } from "@mui/material";
import * as muiColors from "@mui/material/colors";

export const useNodeColors = (color?: string) => {
  const theme = useTheme();

  let nodeColor = theme.palette.primary.main;
  let shadowColor = theme.palette.primary.dark;
  type ColorName = keyof typeof muiColors;
  if (color && color in muiColors) {
    const colorMap = muiColors[color as ColorName];
    if ("500" in colorMap) {
      nodeColor = shadowColor = colorMap[500];
    }
  }

  return { nodeColor, shadowColor };
};
