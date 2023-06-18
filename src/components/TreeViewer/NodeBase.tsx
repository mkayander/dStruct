"use client";

import {
  alpha,
  Box,
  keyframes,
  type SxProps,
  type Theme,
  Typography,
  useTheme,
} from "@mui/material";
import clsx from "clsx";
import React from "react";
import { ArcherElement } from "react-archer";
import { type RelationType } from "react-archer/lib/types";

import { type TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";

const nodeSize = "42px";

const nodeProps: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  p: 1,
  width: nodeSize,
  height: nodeSize,
};

const blinkKeyframes = keyframes`
  0% {
    transform: scale(1);
  }

  15% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
  }
`;

const animationSx = {
  "&.blink": {
    animation: `${blinkKeyframes} 0.24s ease-out`,
  },
};

export type NodeBaseProps = TreeNodeData & {
  nodeColor: string;
  shadowColor: string;
  relations: RelationType[];
};

export const NodeBase: React.FC<NodeBaseProps> = ({
  id,
  value,
  nodeColor,
  shadowColor,
  animation,
  isHighlighted,
  x,
  y,
  relations,
}: NodeBaseProps) => {
  const theme = useTheme();

  const handleBlink = () => {
    // api.start({
  };

  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 1,
        width: "fit-content",
        left: x,
        top: y,
      }}
    >
      <Box
        sx={{
          position: "relative",
          "&:hover": {
            cursor: "pointer",
            "& > .node-overlay": {
              opacity: "0.1!important",
            },
          },
        }}
      >
        <ArcherElement
          id={id}
          relations={relations.length > 0 ? relations : undefined}
        >
          <Box
            className={animation}
            onClick={handleBlink}
            sx={{
              ...nodeProps,
              ...animationSx,
              borderRadius: "50%",
              background: alpha(nodeColor, 0.3),
              border: `1px solid ${alpha(theme.palette.primary.light, 0.1)}`,
              backdropFilter: "blur(4px)",
              userSelect: "none",
              boxShadow: `0px 0px 18px -2px ${alpha(shadowColor, 0.5)}`,
              color: theme.palette.primary.contrastText,
              transition: "all .2s",
            }}
          />
        </ArcherElement>
        <Typography
          component="span"
          color="white"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          {value}
        </Typography>
        <Box
          className={clsx("node-overlay", animation)}
          sx={{
            ...animationSx,
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            borderRadius: "50%",
            background: "white",
            pointerEvents: "none",
            transition: "opacity .1s",
            opacity: isHighlighted ? 0.1 : 0,
          }}
        />
      </Box>

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
    </Box>
  );
};
