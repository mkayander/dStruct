import { Box } from "@mui/material";
import type { EntityState } from "@reduxjs/toolkit";
import React, { useEffect } from "react";

import { BinaryNode } from "#/components/BinaryNode";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { selectCallstack } from "#/store/reducers/callstackReducer";
import {
  type BinaryTreeNodeData,
  treeNodeSlice,
} from "#/store/reducers/treeNodeReducer";
import { validateAnimationName } from "#/utils";

type NodesViewProps = {
  treeName: string;
  nodes: EntityState<BinaryTreeNodeData>;
  playbackInterval: number;
  replayCount: number;
};

export const NodesView: React.FC<NodesViewProps> = ({
  treeName,
  nodes,
  playbackInterval,
  replayCount,
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

        case "setLeftChild":
          dispatch(
            treeNodeSlice.actions.update({
              name: treeName,
              data: {
                id: frame.nodeId,
                changes: {
                  left: frame.args[0] || undefined,
                },
              },
            })
          );
          break;
        case "setRightChild":
          dispatch(
            treeNodeSlice.actions.update({
              name: treeName,
              data: {
                id: frame.nodeId,
                changes: {
                  right: frame.args[0] || undefined,
                },
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

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {Object.values(nodes.entities).map(
        (node) =>
          node && <BinaryNode key={node.id} treeName={treeName} {...node} />
      )}
    </Box>
  );
};
