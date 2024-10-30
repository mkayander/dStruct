import { alpha, Box, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useRef } from "react";

import { useNodeAnimations, useNodeColors } from "#/hooks";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";

import { NestedStructure } from "./NestedStructure";
import { NodeOverlay } from "./NodeOverlay";

type ArrayItemProps = {
  item: ArrayItemData;
  colorMap?: Record<number | string, string> | null;
  size?: number;
  isGrid?: boolean;
};

export const ArrayItem: React.FC<ArrayItemProps> = ({
  item,
  colorMap,
  size = 42,
  isGrid,
}) => {
  const valueColor = colorMap?.[String(item.value)];
  const { nodeColor } = useNodeColors(item.color ?? valueColor, false);
  const isChildNested = Boolean(item.childName);
  const ref = useRef<HTMLDivElement>(null);

  const animation = useNodeAnimations(ref, item.animation, item.animationCount);

  return (
    <Box
      className={clsx("array-item", { "grid-item": isGrid })}
      sx={{
        position: "relative",
        minWidth: size,
        height: size,
        marginLeft: isGrid ? 0 : "1px",
        backgroundColor: nodeColor && alpha(nodeColor, 0.1),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "background-color 0.1s",

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
      <NodeOverlay
        ref={ref}
        animation={animation}
        isChildNested={isChildNested}
      />
      <Typography
        sx={{ textAlign: "center", wordWrap: "none", pt: 0.32, mx: 1 }}
      >
        {isChildNested ? (
          <NestedStructure item={item} colorMap={colorMap} />
        ) : (
          item.value
        )}
      </Typography>
    </Box>
  );
};
