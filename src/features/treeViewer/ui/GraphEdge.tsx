import { Box, Typography, useTheme } from "@mui/material";

import { getNodeColors } from "#/hooks/useNodeColors";
import { useAppSelector } from "#/store/hooks";
import {
  type EdgeData,
  selectNodeDataById,
} from "#/store/reducers/structures/treeNodeReducer";

const NODE_OFFSET = 21;
const THICKNESS = 4;

export type GraphEdgeProps = EdgeData & {
  treeName: string;
};

export const GraphEdge: React.FC<GraphEdgeProps> = ({
  treeName,
  sourceId,
  targetId,
  label,
  isDirected,
}) => {
  const theme = useTheme();
  const source = useAppSelector(selectNodeDataById(treeName, sourceId));
  const target = useAppSelector(selectNodeDataById(treeName, targetId));

  if (!source || !target) return null;

  const x1 = source.x + NODE_OFFSET;
  const y1 = source.y + NODE_OFFSET;
  const x2 = target.x + NODE_OFFSET;
  const y2 = target.y + NODE_OFFSET;

  const distance = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  const sourceColor = getNodeColors(theme, source.color).nodeColor;
  const targetColor = getNodeColors(theme, target.color).nodeColor;
  const gradient = `linear-gradient(to right, ${sourceColor}, ${targetColor})`;

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          height: THICKNESS,
          transformOrigin: "0 50%",
          width: distance,
          top: y1 - THICKNESS / 2,
          left: x1,
          transform: `rotate(${angle}deg)`,

          transition: "opacity 0.3s",
          background: gradient,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",

          opacity: 0.5,
          "&:hover": {
            opacity: 1,
          },

          span: {
            transform: `rotate(${-angle}deg)`,
          },
        }}
      >
        {isDirected ? (
          <Box
            sx={{
              position: "absolute",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: `8px solid ${targetColor}`,
              top: "50%",
              right: 16,
              transform: "translateY(-50%) rotate(-90deg) scaleY(2)",
            }}
          />
        ) : null}
      </Box>
      {label ? (
        <Typography
          component="span"
          sx={{
            position: "absolute",
            top: (y1 + y2) / 2,
            left: (x1 + x2) / 2,
            transform: `translate(-50%, -50%) rotate(${angle > 100 || angle < -100 ? angle + 180 : angle}deg)`,
            fontSize: 14,
            textShadow: "0 0 6px rgba(255, 255, 255, 0.7)",
            pointerEvents: "none",
          }}
        >
          {label}
        </Typography>
      ) : null}
    </>
  );
};
