import { alpha, Box } from "@mui/material";
import React from "react";

import { useNodeColors } from "#/hooks";
import type { ArrayItemData } from "#/store/reducers/structures/arrayReducer";
import { safeStringify } from "#/utils/stringifySolutionResult";

type MapItemProps = {
  item: ArrayItemData;
  colorMap?: Record<number | string, string>;
};

export const MapItem: React.FC<MapItemProps> = ({
  item: { key, value, color },
  colorMap,
}) => {
  const valueColor = colorMap?.[value];
  const { nodeColor } = useNodeColors(color ?? valueColor, false);

  return (
    <Box
      component="tr"
      sx={{
        position: "relative",
        height: 44,
        backgroundColor: nodeColor && alpha(nodeColor, 0.1),
        td: {
          minWidth: 44,
          padding: "0 8px",
          "&.arrow": {
            opacity: 0.7,
            minWidth: "initial",
            padding: "initial",
          },
        },

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
      }}
    >
      <td>{safeStringify(key)}</td>
      <td className="arrow">&rArr;</td>
      <td>{safeStringify(value)}</td>
    </Box>
  );
};
