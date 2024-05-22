import { alpha, Box, type BoxProps, lighten, useTheme } from "@mui/material";
import React from "react";

type PanelWrapperProps = BoxProps;

export const PanelWrapper: React.FC<PanelWrapperProps> = ({
  children,
  sx,
  ...restProps
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        borderRadius: 2,
        background: lighten(theme.palette.background.paper, 0.1),
        position: "relative",
        ...sx,

        "::after": {
          content: '""',
          position: "absolute",
          top: 2,
          left: 2,
          right: 2,
          bottom: 2,
          width: "calc(100% - 4px)",
          height: "calc(100% - 4px)",
          pointerEvents: "none",
          borderRadius: 1.5,
          boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.light, 0)}`,
          transition: "box-shadow 0.1s",
        },

        "&:focus-within": {
          outline: "none",
          "::after": {
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.light, 0.24)}`,
          },
        },
      }}
      tabIndex={0}
      {...restProps}
    >
      {children}
    </Box>
  );
};
