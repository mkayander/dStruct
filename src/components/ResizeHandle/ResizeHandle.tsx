import { alpha, Box } from "@mui/material";
import { styled } from "@mui/material";
import React from "react";
import { PanelResizeHandle } from "react-resizable-panels";

type ResizeHandleProps = {
  id?: string;
};

const StyledPanelResizeHandle = styled(PanelResizeHandle)(({ theme }) => ({
  ".ResizeHandleOuter": {
    background: "transparent",
    flex: "0 0 12px",
    position: "relative",
    outline: "none",
  },
  "&": {
    background: "transparent",
    flex: "0 0 12px",
    position: "relative",
    outline: "none",
  },
  "&:hover": {
    ".ResizeHandleInner": {
      background: alpha(theme.palette.primary.light, 0.3),
    },
  },
  "&[data-resize-handle-active]": {
    ".ResizeHandleInner": {
      background: theme.palette.primary.light,
    },
  },
  ".icon": {
    width: "1em",
    height: "1em",
    position: "absolute",
    fontSize: "11px",
    transition: "color 0.2s",
    color: "transparent",
    left: "calc(50% - 11px)",
    top: "calc(50% - 11px)",
  },
}));

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ id }) => {
  return (
    <StyledPanelResizeHandle className="ResizeHandleOuter" id={id}>
      <Box
        className="ResizeHandleInner"
        sx={{
          position: "absolute",
          top: 2,
          bottom: 2,
          left: 2,
          right: 2,
          borderRadius: "6px",
          backgroundColor: "transparent",
          transition: "background-color 0.2s linear",
        }}
      >
        <svg className={"icon"} viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"
          />
        </svg>
      </Box>
    </StyledPanelResizeHandle>
  );
};
