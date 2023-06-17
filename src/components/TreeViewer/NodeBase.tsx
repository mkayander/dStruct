"use client";

import {
  alpha,
  Box,
  type SxProps,
  type Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { animated, useSpring } from "@react-spring/web";
import React, { useEffect } from "react";
import { ArcherElement } from "react-archer";
import { type RelationType } from "react-archer/lib/types";

import { useAppSelector } from "#/store/hooks";
import { selectCallstackIsReady } from "#/store/reducers/callstackReducer";
import { type TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";

const nodeSize = "42px";

const nodeProps: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  p: 1,
  width: nodeSize,
  height: nodeSize,
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
  const [springs, api] = useSpring(() => ({
    from: { scale: 1 },
  }));
  const [overlaySprings, overlayApi] = useSpring(() => ({
    from: { opacity: 0 },
  }));
  const [containerSprings, containerApi] = useSpring(() => ({
    from: { left: x, top: y },
    config: {
      duration: 50,
    },
  }));

  const isCallstackReady = useAppSelector(selectCallstackIsReady);

  const handleBlink = () => {
    api.start({
      from: { scale: 1.3 },
      to: { scale: 1 },
    });
    overlayApi.start({
      from: { opacity: 0.1 },
      to: { opacity: 0 },
    });
  };

  useEffect(() => {
    if (isCallstackReady) {
      containerApi.start({ left: x, top: y });
    } else {
      containerApi.set({ left: x, top: y });
    }
  }, [containerApi, isCallstackReady, x, y]);

  useEffect(() => {
    if (animation === "blink") {
      handleBlink();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation]);

  useEffect(() => {
    overlayApi.set({ opacity: isHighlighted ? 0.1 : 0 });
  }, [isHighlighted, overlayApi]);

  return (
    <animated.div
      style={{
        position: "absolute",
        zIndex: 1,
        width: "fit-content",
        ...containerSprings,
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
          <animated.div style={springs}>
            <Box
              onClick={handleBlink}
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
              }}
            ></Box>
          </animated.div>
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
        <animated.div
          className="node-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            borderRadius: "50%",
            background: "white",
            pointerEvents: "none",
            transition: "opacity .1s",
            ...springs,
            ...overlaySprings,
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
    </animated.div>
  );
};
