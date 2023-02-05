import { alpha, Box, type SxProps, type Theme, useTheme } from "@mui/material";
import * as muiColors from "@mui/material/colors";
import React from "react";
import { ArcherElement } from "react-archer";
import type { RelationType } from "react-archer/lib/types";

import { useAppSelector } from "#/store/hooks";
import {
  type BinaryTreeNodeData,
  selectNodeDataById,
} from "#/store/reducers/treeNodeReducer";

const nodeProps: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  p: 1,
  width: "42px",
  height: "42px",
};

const relationProps = {
  targetAnchor: "middle",
  sourceAnchor: "middle",
} as const;

const GapElement = () => <Box sx={{ ...nodeProps, pointerEvents: "none" }} />;

type BinaryNodeProps = BinaryTreeNodeData;

export const BinaryNode: React.FC<BinaryNodeProps> = ({
  id,
  value,
  left,
  right,
  color,
}: BinaryNodeProps) => {
  const theme = useTheme();

  const isLeaf = !left && !right;

  const leftNode = useAppSelector(selectNodeDataById(left ?? ""));
  const rightNode = useAppSelector(selectNodeDataById(right ?? ""));

  let nodeColor = theme.palette.primary.main;
  let shadowColor = theme.palette.primary.dark;
  type ColorName = keyof typeof muiColors;
  if (color && color in muiColors) {
    const colorMap = muiColors[color as ColorName];
    if ("500" in colorMap) {
      nodeColor = shadowColor = colorMap[500];
    }
  }

  const leftLinkColor =
    leftNode?.color && color === leftNode.color
      ? alpha(nodeColor, 0.4)
      : undefined;
  const rightLinkColor =
    rightNode?.color && color === rightNode.color
      ? alpha(nodeColor, 0.4)
      : undefined;

  const relations: RelationType[] = [];
  if (leftNode)
    relations.push({
      ...relationProps,
      targetId: leftNode.id,
      style: { strokeColor: leftLinkColor },
    });
  if (rightNode)
    relations.push({
      ...relationProps,
      targetId: rightNode.id,
      style: { strokeColor: rightLinkColor },
    });

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        zIndex: 1,
        flexFlow: "column nowrap",
        alignItems: "center",
        width: "fit-content",
        gap: 2,
      }}
    >
      <ArcherElement id={id} relations={relations}>
        <Box
          sx={{
            ...nodeProps,
            borderRadius: "50%",
            background: alpha(nodeColor, 0.3),
            border: `1px solid ${alpha(theme.palette.primary.light, 0.1)}`,
            backdropFilter: "blur(4px)",
            userSelect: "none",
            boxShadow: `0px 0px 18px -2px ${alpha(shadowColor, 0.5)}`,
            color: theme.palette.primary.contrastText,
            transition: "all .2s",

            "&:hover": {
              background: alpha(theme.palette.primary.light, 0.4),
            },
          }}
        >
          {value}
        </Box>
      </ArcherElement>

      <Box
        sx={{
          position: "absolute",
          zIndex: -1,
          top: "13px",
          left: "50%",
          transform: "translate(-50%, 0)",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: theme.palette.primary.main,
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexFlow: "row nowrap",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {leftNode ? <BinaryNode {...leftNode} /> : !isLeaf && <GapElement />}
        {rightNode ? <BinaryNode {...rightNode} /> : !isLeaf && <GapElement />}
      </Box>
    </Box>
  );
};
