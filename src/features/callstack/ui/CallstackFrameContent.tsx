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
};

export const CallstackNodeBadge: React.FC<CallstackNodeBadgeProps> = ({
  treeName,
  id,
  size = 32,
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

  return (
    <Tooltip
      title={`id: ${id}`}
      arrow
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box
        component="span"
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
    </Tooltip>
  );
};

type CallstackArgumentsValueProps = {
  frame: CallFrame;
};

export const CallstackArgumentsValue: React.FC<
  CallstackArgumentsValueProps
> = ({ frame }) => {
  if (!("args" in frame)) {
    return <span>---</span>;
  }

  switch (frame.name) {
    case "setLeftChild":
    case "setRightChild":
      return frame.args.childId ? (
        <CallstackNodeBadge treeName={frame.treeName} id={frame.args.childId} />
      ) : (
        <span>null</span>
      );

    default: {
      const value = safeStringify(frame.args);
      return (
        <Tooltip title={<pre>{value}</pre>} arrow>
          <Box
            sx={{
              overflow: "hidden",
              maxWidth: "70vh",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </Box>
        </Tooltip>
      );
    }
  }
};
