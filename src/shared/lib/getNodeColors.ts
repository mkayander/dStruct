import { type Theme } from "@mui/material";
import * as muiColors from "@mui/material/colors";

export const getNodeColors = (
  theme: Theme,
  color?: string | null,
  useDefaultPrimary = true,
) => {
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
