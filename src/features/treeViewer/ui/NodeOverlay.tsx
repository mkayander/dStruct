import { Box } from "@mui/material";
import React from "react";

export interface NodeOverlayProps {
  animation?: string | null;
  isChildNested?: boolean;
}

export const NodeOverlay = React.forwardRef<HTMLDivElement, NodeOverlayProps>(
  ({ animation, isChildNested }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          position: "absolute",
          zIndex: 15,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `rgba(255, 255, 255, ${isChildNested ? 0.05 : 0.1})`,
          opacity: 0,
          transition: "opacity 0.1s",
          animation,

          "&:hover": {
            opacity: 0.3,
          },
        }}
      />
    );
  },
);

NodeOverlay.displayName = "NodeOverlay";
