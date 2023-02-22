import { alpha, Box, useTheme } from "@mui/material";
import * as muiColors from "@mui/material/colors";
import React, { useEffect, useRef } from "react";

import { useAppSelector } from "#/store/hooks";
import {
  type BinaryTreeNodeData,
  selectAllNodeData,
} from "#/store/reducers/treeNodeReducer";

type SvgNodeProps = BinaryTreeNodeData;

const isHTMLCircle = (
  element: HTMLElement | SVGCircleElement | null
): element is SVGCircleElement => {
  if (!element) return false;
  return element instanceof SVGCircleElement;
};

const getSvgCircleById = (id?: string): SVGCircleElement | null => {
  if (!id) return null;
  const element = document.getElementById(id);
  if (!element) return null;
  if (isHTMLCircle(element)) {
    return element;
  }
  return null;
};

const SvgNode: React.FC<SvgNodeProps> = ({ id, left, right, color }) => {
  const theme = useTheme();

  const ref = useRef<SVGCircleElement | null>(null);
  const leftRef = useRef<SVGCircleElement | null>(null);
  const rightRef = useRef<SVGCircleElement | null>(null);

  let nodeColor = theme.palette.primary.main;
  let shadowColor = theme.palette.primary.dark;
  type ColorName = keyof typeof muiColors;
  if (color && color in muiColors) {
    const colorMap = muiColors[color as ColorName];
    if ("500" in colorMap) {
      nodeColor = shadowColor = colorMap[500];
    }
  }

  useEffect(() => {
    leftRef.current = getSvgCircleById(left);
  }, [left, leftRef]);
  useEffect(() => {
    rightRef.current = getSvgCircleById(right);
  }, [right, rightRef]);

  useEffect(() => {
    if (!ref.current) return;

    const offset = 14;

    if (leftRef.current) {
      leftRef.current.setAttribute(
        "cx",
        String(ref.current.cx.baseVal.value - offset)
      );
      leftRef.current.setAttribute(
        "cy",
        String(ref.current.cy.baseVal.value + offset)
      );
    }

    if (rightRef.current) {
      rightRef.current.setAttribute(
        "cx",
        String(ref.current.cx.baseVal.value + offset)
      );
      rightRef.current.setAttribute(
        "cy",
        String(ref.current.cy.baseVal.value + offset)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, leftRef.current, rightRef.current]);

  return (
    <Box
      ref={ref}
      component="circle"
      id={id}
      cx="50"
      cy="5"
      r="5"
      strokeWidth="3"
      fill={nodeColor}
      sx={{
        transition: ".3s",
        boxShadow: `0px 0px 18px -2px ${alpha(shadowColor, 0.5)}`,
        "&:hover": {
          fill: theme.palette.primary.light,
        },
      }}
    />
  );
};

export const SvgTree: React.FC = () => {
  // const treeData = useAppSelector(treeDataSelector);
  const nodes = useAppSelector(selectAllNodeData);

  return (
    <Box>
      <svg viewBox="0 0 140 140">
        {nodes.map((node) => (
          <SvgNode key={node.id} {...node} />
        ))}
      </svg>
    </Box>
  );
};
