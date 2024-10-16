import { alpha, Box, Typography } from "@mui/material";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";

import { useNodeColors } from "#/hooks";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";

import { NestedStructure } from "./NestedStructure";

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

  useEffect(() => {
    if (ref.current) {
      const animation = ref.current.style.animation;
      ref.current.style.animation = "none";
      void ref.current.offsetWidth;
      ref.current.style.animation = animation;
    }
  }, [item.animationCount]);

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
      <Box
        ref={ref}
        sx={{
          position: "absolute",
          zIndex: 15,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(255, 255, 255, 0.1)",
          opacity: 0,
          transition: "opacity 0.1s",
          animation: `${item.animation} 0.3s ease-in-out`,

          "&:hover": {
            opacity: 0.3,
          },
        }}
      />
      <Typography
        sx={{ textAlign: "center", wordWrap: "none", pt: 0.32, mx: 1 }}
      >
        {isChildNested ? <NestedStructure item={item} /> : item.value}
      </Typography>
    </Box>
  );
};
