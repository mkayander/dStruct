import { Box, type BoxProps } from "@mui/material";
import React from "react";

type PanelWrapperProps = BoxProps;

export const PanelWrapper: React.FC<PanelWrapperProps> = ({
  children,
  sx,
  ...restProps
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        position: "relative",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        ...sx,
      }}
      {...restProps}
    >
      {children}
    </Box>
  );
};
