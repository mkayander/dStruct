import { alpha, Box } from "@mui/material";
import React from "react";

import { NestedStructure } from "#/components/molecules/TreeViewer/NestedStructure";
import { useNodeColors } from "#/hooks";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";
import { safeStringify } from "#/utils/stringifySolutionResult";

type MapItemProps = {
  item: ArrayItemData;
  colorMap?: Record<number | string, string> | null;
};

export const MapItem: React.FC<MapItemProps> = ({ item, colorMap }) => {
  const { key, value, childName, color } = item;
  const valueColor = colorMap?.[String(value)];
  const { nodeColor } = useNodeColors(color ?? valueColor, false);
  const isValueNested = Boolean(childName);

  return (
    <Box
      component="tr"
      sx={{
        position: "relative",
        height: 44,
        backgroundColor: nodeColor && alpha(nodeColor, 0.1),
        td: {
          minWidth: 22,
          padding: "4px",
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
          // borderRadius: "4px",
          background: "rgba(255, 255, 255, 0.1)",
          opacity: 0,
          transition: "opacity 0.1s",
          backdropFilter: "blur(2px)",
        },

        "&:hover::after": {
          opacity: 0.3,
        },
      }}
    >
      <td style={{ textAlign: "center" }}>{safeStringify(key)}</td>
      <td className="arrow">&rArr;</td>
      <td style={{ position: "relative", zIndex: 20 }}>
        {isValueNested ? <NestedStructure item={item} /> : safeStringify(value)}
      </td>
    </Box>
  );
};
