import { alpha, Box, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ArcherContainer } from "react-archer";
import ScrollContainer from "react-indiana-drag-scroll";

import { BinaryNode } from "#/components/BinaryNode";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { selectCallstack } from "#/store/reducers/callstackReducer";
import {
  selectRootNodeData,
  treeNodeSlice,
} from "#/store/reducers/treeNodeReducer";

const overlayStyles = {
  content: "''",
  height: "100%",
  width: "32px",
  position: "absolute",
  pointerEvents: "none",
  top: 0,
  zIndex: 10,
  transition: "opacity .3s",
};

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

  const scrollRef = useRef<HTMLElement>() as React.Ref<HTMLElement>;
  const [scrolledStart, setScrolledStart] = useState(true);
  const [scrolledEnd, setScrolledEnd] = useState(true);

  const { isReady: callstackIsReady, frames: callstack } =
    useAppSelector(selectCallstack);
  const rootNodeData = useAppSelector(selectRootNodeData);

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

        case "setLeftChild":
          dispatch(
            treeNodeSlice.actions.update({
              id: frame.nodeId,
              changes: {
                left: frame.args[0] || undefined,
              },
            })
          );
          break;
        case "setRightChild":
          dispatch(
            treeNodeSlice.actions.update({
              id: frame.nodeId,
              changes: {
                right: frame.args[0] || undefined,
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

  const handleScroll = () => {
    // TODO: The Ref types from the "indiana" library should be fixed
    const current = (scrollRef as React.MutableRefObject<HTMLElement>).current;
    const offset = 10;

    setScrolledStart(current.scrollLeft <= offset);
    setScrolledEnd(
      current.scrollLeft + current.offsetWidth >= current.scrollWidth - offset
    );
  };

  useEffect(() => {
    handleScroll();
  }, [rootNodeData]);

  useEffect(() => {
    const handler = () => {
      handleScroll();
    };
    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      rowGap={1}
      borderRadius={1}
      position="relative"
      width="100%"
      sx={{
        "&:before": {
          ...overlayStyles,
          left: 0,
          background: "linear-gradient(90deg, black, transparent)",
          opacity: scrolledStart ? 0 : 0.3,
        },
        "&:after": {
          ...overlayStyles,
          right: 0,
          background: "linear-gradient(-90deg, black, transparent)",
          opacity: scrolledEnd ? 0 : 0.3,
        },
        ".indiana-scroll-container": {
          cursor: !scrolledStart || !scrolledEnd ? "grab" : "initial",
        },
        ".indiana-scroll-container--dragging": {
          cursor: "grabbing",
        },
      }}
    >
      <ScrollContainer innerRef={scrollRef} onScroll={handleScroll}>
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
            {rootNodeData && (
              <BinaryNode parentId="tree-parent" {...rootNodeData} />
            )}
          </ArcherContainer>
        </Box>
      </ScrollContainer>
    </Box>
  );
};
