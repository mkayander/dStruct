import { alpha, Box, Tooltip, useTheme } from "@mui/material";
import React from "react";

import {
  selectNodeDataById,
  treeNodeSlice,
} from "#/entities/dataStructures/node/model/nodeSlice";
import type { CallFrame } from "#/features/callstack/model/callstackSlice";
import { safeStringify } from "#/shared/lib/stringifySolutionResult";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

type CallstackNodeBadgeProps = {
  treeName: string;
  id: string;
  size?: number;
  showTooltip?: boolean;
};

export const CallstackNodeBadge: React.FC<CallstackNodeBadgeProps> = ({
  treeName,
  id,
  size = 32,
  showTooltip = true,
}) => {
  const theme = useTheme();
  const nodeData = useAppSelector(selectNodeDataById(treeName, id));
  const dispatch = useAppDispatch();

  if (!nodeData) return <span>{id}</span>;

  const handleMouseEnter: React.MouseEventHandler<HTMLSpanElement> = () => {
    dispatch(
      treeNodeSlice.actions.update({
        name: treeName,
        data: {
          id: nodeData.id,
          changes: {
            isHighlighted: true,
          },
        },
      }),
    );
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLSpanElement> = () => {
    dispatch(
      treeNodeSlice.actions.update({
        name: treeName,
        data: {
          id: nodeData.id,
          changes: {
            isHighlighted: false,
          },
        },
      }),
    );
  };

  const badge = (
    <Box
      component="span"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: size,
        height: size,
        display: "inline-grid",
        placeItems: "center",
        background: alpha(theme.palette.primary.main, 0.1),
        borderRadius: "50%",
        fontSize: size <= 24 ? "0.72rem" : "0.8rem",
      }}
    >
      {nodeData.value}
    </Box>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <Tooltip title={`id: ${id}`} arrow>
      {badge}
    </Tooltip>
  );
};

type CallstackArgumentsValueProps = {
  frame: CallFrame;
  showTooltip?: boolean;
};

export const CallstackArgumentsValue: React.FC<
  CallstackArgumentsValueProps
> = ({ frame, showTooltip = true }) => {
  if (!("args" in frame)) {
    return <span>---</span>;
  }

  switch (frame.name) {
    case "setLeftChild":
    case "setRightChild":
      return frame.args.childId ? (
        <CallstackNodeBadge
          treeName={frame.treeName}
          id={frame.args.childId}
          showTooltip={showTooltip}
        />
      ) : (
        <span>null</span>
      );

    default: {
      const value = safeStringify(frame.args);
      return (
        <Box
          sx={{
            overflow: "hidden",
            maxWidth: "70vh",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {showTooltip ? (
            <Tooltip title={<pre>{value}</pre>} arrow>
              <Box component="span">{value}</Box>
            </Tooltip>
          ) : (
            value
          )}
        </Box>
      );
    }
  }
};
