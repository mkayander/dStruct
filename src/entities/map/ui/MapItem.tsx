import { alpha, Box } from "@mui/material";
import React, { useRef } from "react";

import { NestedStructure } from "#/features/treeViewer/ui/NestedStructure";
import { NodeOverlay } from "#/features/treeViewer/ui/NodeOverlay";
import { useNodeAnimations, useNodeColors } from "#/shared/hooks";
import { safeStringify } from "#/shared/lib/stringifySolutionResult";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";

type MapItemProps = {
  item: ArrayItemData;
  colorMap?: Record<number | string, string> | null;
};

export const MapItem: React.FC<MapItemProps> = ({ item, colorMap }) => {
  const { key, value, childName, color, animation, animationCount } = item;
  const valueColor = colorMap?.[String(value)];
  const ref = useRef<HTMLDivElement>(null);
  const { nodeColor } = useNodeColors(color ?? valueColor, false);
  const nodeAnimation = useNodeAnimations(ref, animation, animationCount);
  const isChildNested = Boolean(childName);

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
      }}
    >
      <td style={{ textAlign: "center" }}>
        <NodeOverlay
          ref={ref}
          animation={nodeAnimation}
          isChildNested={isChildNested}
        />

        {safeStringify(key)}
      </td>
      <td className="arrow">&rArr;</td>
      <td style={{ position: "relative", zIndex: 20 }}>
        {isChildNested ? <NestedStructure item={item} /> : safeStringify(value)}
      </td>
    </Box>
  );
};
