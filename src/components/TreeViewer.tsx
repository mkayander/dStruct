import { alpha, Box, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { ArcherContainer } from "react-archer";
import ScrollContainer from "react-indiana-drag-scroll";

import { BinaryNode } from "#/components/BinaryNode";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { selectCallstack } from "#/store/reducers/callstackReducer";
import {
  selectRootNodeData,
  treeNodeSlice,
} from "#/store/reducers/treeNodeReducer";

type TreeViewerProps = {
  playbackInterval: number;
  replayCount: number;
};

export const TreeViewer: React.FC<TreeViewerProps> = ({
  playbackInterval,
  replayCount,
}) => {
  const theme = useTheme();

  const dispatch = useAppDispatch();

  const { isReady: callstackIsReady, frames: callstack } =
    useAppSelector(selectCallstack);
  const rootNodeData = useAppSelector(selectRootNodeData);

  useEffect(() => {
    console.log("Callstack:\n", callstack);

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
              id: frame.nodeId,
              changes: {
                color: frame.args[0] || undefined,
              },
            })
          );
          break;

        case "setVal":
          dispatch(
            treeNodeSlice.actions.update({
              id: frame.nodeId,
              changes: {
                value: frame.args[0] || undefined,
              },
            })
          );
          break;

        case "blink":
          dispatch(
            treeNodeSlice.actions.update({
              id: frame.nodeId,
              changes: {
                animation: "blink",
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
  }, [callstack, callstackIsReady, dispatch, replayCount, playbackInterval]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      rowGap={1}
      my={1}
      borderRadius={1}
    >
      <ScrollContainer>
        <Box
          sx={{
            m: 3,
            path: {
              transition: "all 0.3s",
            },
          }}
        >
          <ArcherContainer
            lineStyle="straight"
            strokeColor={alpha(theme.palette.primary.dark, 0.5)}
            strokeWidth={4}
            endMarker={false}
            svgContainerStyle={{ overflow: "visible" }}
          >
            {rootNodeData && <BinaryNode {...rootNodeData} />}
          </ArcherContainer>
        </Box>
      </ScrollContainer>
    </Box>
  );
};
