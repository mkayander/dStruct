import { Box, type SxProps } from "@mui/material";
import React, { type PropsWithChildren } from "react";

type PanelWrapperProps = PropsWithChildren<{
  sx?: SxProps;
}>;

export const PanelWrapper: React.FC<PanelWrapperProps> = ({ children, sx }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        borderRadius: 2,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        overflow: "hidden",
        boxShadow: 5,
        zIndex: 5,
        position: "relative",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
