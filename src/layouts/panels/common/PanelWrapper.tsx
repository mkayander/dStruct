import { Box, lighten, type SxProps, useTheme } from "@mui/material";
import React, { type PropsWithChildren } from "react";

type PanelWrapperProps = PropsWithChildren<{
  sx?: SxProps;
}>;

export const PanelWrapper: React.FC<PanelWrapperProps> = ({ children, sx }) => {
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
      }}
    >
      {children}
    </Box>
  );
};
