import { alpha, Box, Typography } from "@mui/material";
import React from "react";

import { useNodeColors } from "#/hooks";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";

type ArrayItemProps = ArrayItemData & {
  colorMap: Record<number | string, string>;
  isGrid?: boolean;
};

export const ArrayItem: React.FC<ArrayItemProps> = ({
  value,
  color,
  colorMap,
  isGrid,
}) => {
  const valueColor = colorMap[value];
  const { nodeColor } = useNodeColors(color ?? valueColor, false);

  return (
    <Box
      className={`array-item ${isGrid ? "grid-item" : ""}`}
      sx={{
        position: "relative",
        minWidth: 42,
        height: 42,
        marginLeft: "1px",
        backgroundColor: nodeColor && alpha(nodeColor, 0.1),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-color 0.1s",

        "&::after": {
          content: '""',
          position: "absolute",
          zIndex: 15,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(255, 255, 255, 0.1)",
          opacity: 0,
          transition: "opacity 0.1s",
          mixBlendMode: "difference",
          backdropFilter: "blur(2px)",
        },

        "&:hover::after": {
          opacity: 0.3,
        },

        "&:not(:last-child)": {
          "&::before": {
            content: '""',
            position: "absolute",
            right: -1,
            width: "1px",
            height: 32,
            backgroundColor: "primary.light",
            opacity: 0.6,
          },

          "&.grid-item": {
            "&::before": {
              height: "100%",
              opacity: 0.3,
            },
          },
        },
      }}
    >
      <Typography
        sx={{ textAlign: "center", wordWrap: "none", pt: 0.32, mx: 1 }}
      >
        {value !== undefined ? String(value) : ""}
      </Typography>
    </Box>
  );
};