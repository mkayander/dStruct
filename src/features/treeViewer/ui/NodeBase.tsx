"use client";

import {
  alpha,
  Box,
  type BoxProps,
  keyframes,
  type SxProps,
  type Theme,
  Typography,
  useTheme,
} from "@mui/material";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";

import {
  type TreeNodeData,
  treeNodeSlice,
} from "#/entities/dataStructures/node/model/nodeSlice";
import { selectCallstackIsReady } from "#/features/callstack/model/callstackSlice";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

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

  5% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
  }
`;

const pulseKeyframes = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
`;

export type NodeBaseProps = Pick<
  BoxProps,
  "style" | "onMouseDown" | "onMouseUp"
> &
  TreeNodeData & {
    treeName: string;
    nodeColor: string;
    shadowColor: string;
    cursor?: "pointer" | "grab";
  };

export const NodeBase: React.FC<NodeBaseProps> = ({
  id,
  treeName,
  value,
  nodeColor,
  shadowColor,
  animation,
  animationCount,
  isHighlighted,
  x,
  y,
  cursor = "pointer",
  onMouseDown,
  onMouseUp,
}: NodeBaseProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const nodeRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isCallstackReady = useAppSelector(selectCallstackIsReady);

  const handleBlink = () => {
    dispatch(
      treeNodeSlice.actions.triggerAnimation({
        name: treeName,
        data: { id, animation: "blink" },
      }),
    );
  };

  useEffect(() => {
    if (!animation || animationCount === undefined) return;

    const element = nodeRef.current;
    if (element) {
      element.classList.remove(animation);
      void element.offsetWidth;
      element.classList.add(animation);
    }

    return () => {
      if (element) {
        element.classList.remove(animation);
      }
    };
  }, [animation, animationCount]);

  return (
    <Box
      sx={{
        position: "absolute",
        zIndex: 1,
        width: "fit-content",
        transition: isCallstackReady ? "all .05s" : "none",
        ".blink": {
          animation: `${blinkKeyframes} 0.24s ease-out`,
        },
        ".pulse": {
          animation: `${pulseKeyframes} 0.5s ease-out infinite`,
        },
      }}
      style={{
        left: x,
        top: y,
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <Box
        ref={nodeRef}
        sx={{
          position: "relative",
          "&:hover": {
            cursor,
            "& > .node-overlay": {
              opacity: "0.1!important",
            },
          },
        }}
      >
        <Box
          onClick={handleBlink}
          title={value}
          sx={{
            ...nodeProps,
            transition: "all .2s",
            borderRadius: "50%",
            background: alpha(nodeColor, 0.3),
            border: `1px solid ${alpha(theme.palette.primary.light, 0.1)}`,
            backdropFilter: "blur(4px)",
            userSelect: "none",
            boxShadow: `0px 0px 18px -2px ${alpha(shadowColor, 0.5)}`,
            color: theme.palette.primary.contrastText,
          }}
        />
        <Typography
          component="span"
          color="white"
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            width: "100%",
            textAlign: "center",
            overflow: "hidden",
            pointerEvents: "none",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            padding: "0 4px",
          }}
        >
          {value}
        </Typography>
        <Box
          ref={overlayRef}
          className={clsx("node-overlay")}
          sx={{
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
