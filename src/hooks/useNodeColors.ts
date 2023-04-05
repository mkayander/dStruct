import { useTheme } from "@mui/material";
import * as muiColors from "@mui/material/colors";

export const useNodeColors = (color?: string, useDefaultPrimary = true) => {
  const theme = useTheme();

  let nodeColor = "";
  let shadowColor = "";
  if (useDefaultPrimary) {
    nodeColor = theme.palette.primary.main;
    shadowColor = theme.palette.primary.dark;
  }
  type ColorName = keyof typeof muiColors;
  if (color && color in muiColors) {
    const colorMap = muiColors[color as ColorName];
    if ("500" in colorMap) {
      nodeColor = shadowColor = colorMap[500];
    }
  } else if (color === "white") {
    nodeColor = shadowColor = "#fff";
  } else if (color === "black") {
    nodeColor = shadowColor = "#000";
  }

  return { nodeColor, shadowColor };
};
