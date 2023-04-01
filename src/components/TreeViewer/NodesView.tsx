import { Box, type SxProps } from "@mui/material";
import type { EntityState } from "@reduxjs/toolkit";
import React, { useEffect } from "react";

import { BinaryNode } from "#/components/TreeViewer/BinaryNode";
import { LinkedListNode } from "#/components/TreeViewer/LinkedListNode";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { selectCallstack } from "#/store/reducers/callstackReducer";
import {
  type TreeNodeData,
  treeNodeSlice,
} from "#/store/reducers/structures/treeNodeReducer";
import { validateAnimationName } from "#/utils";
import { type ArgumentTreeType, ArgumentType } from "#/utils/argumentObject";

type NodesViewProps = {
  treeName: string;
  type: ArgumentTreeType;
  nodes: EntityState<TreeNodeData>;
  playbackInterval: number;
  replayCount: number;
  sx?: SxProps;
};

export const NodesView: React.FC<NodesViewProps> = ({
  treeName,
  type,
  nodes,
  playbackInterval,
  replayCount,
  sx,
}) => {
  const dispatch = useAppDispatch();

  const { isReady: callstackIsReady, frames: callstack } =
    useAppSelector(selectCallstack);

  useEffect(() => {
    let isStarted = false;

    if (!callstackIsReady || callstack.length === 0) return;

    let i = 0;

    const intervalId = setInterval(() => {
      const frame = callstack[i];

      if (i >= callstack.length || !frame) {
        clearInterval(intervalId);
        return;
      }

      switch (frame.name) {
        case "setColor":
          dispatch(
            treeNodeSlice.actions.update({
              name: treeName,
              data: {
                id: frame.nodeId,
                changes: {
                  color: frame.args[0] || undefined,
                  animation: validateAnimationName(frame.args[1]),
                },
              },
            })
          );
          break;

        case "setVal":
          dispatch(
            treeNodeSlice.actions.update({
              name: treeName,
              data: {
                id: frame.nodeId,
                changes: {
                  value: frame.args[0] || undefined,
                },
              },
            })
          );
          break;

        case "setNextNode":
        case "setLeftChild":
          dispatch(
            treeNodeSlice.actions.setChildId({
              name: treeName,
              data: {
                id: frame.nodeId,
                index: 0,
                childId: frame.args[0] || undefined,
              },
            })
          );
          break;
        case "setRightChild":
          dispatch(
            treeNodeSlice.actions.setChildId({
              name: treeName,
              data: {
                id: frame.nodeId,
                index: 1,
                childId: frame.args[0] || undefined,
              },
            })
          );
          break;

        case "blink":
          dispatch(
            treeNodeSlice.actions.update({
              name: treeName,
              data: {
                id: frame.nodeId,
                changes: {
                  animation: "blink",
                },
              },
            })
          );
      }

      isStarted = true;

      i++;
    }, playbackInterval);

    return () => {
      clearInterval(intervalId);
      isStarted && dispatch(treeNodeSlice.actions.resetAll());
    };
  }, [
    callstack,
    callstackIsReady,
    dispatch,
    replayCount,
    playbackInterval,
    treeName,
  ]);

  const Node = type === ArgumentType.BINARY_TREE ? BinaryNode : LinkedListNode;

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        ...sx,
      }}
    >
      {Object.values(nodes.entities).map(
        (node) =>
          node && (
            <Node key={node.id} treeName={treeName} type={type} {...node} />
          )
      )}
    </Box>
  );
};
