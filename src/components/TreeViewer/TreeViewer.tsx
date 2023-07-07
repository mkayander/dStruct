"use client";

import { alpha, Box, Stack, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArcherContainer } from "react-archer";
import ScrollContainer from "react-indiana-drag-scroll";

import { ArrayStructureView } from "#/components/TreeViewer/ArrayStructureView";
import { MatrixStructureView } from "#/components/TreeViewer/MatrixStructureView";
import { NodesView } from "#/components/TreeViewer/NodesView";
import { useArgumentsParsing, useNodesRuntimeUpdates } from "#/hooks";
import { useAppSelector } from "#/store/hooks";
import { arrayDataSelector } from "#/store/reducers/structures/arrayReducer";
import {
  type TreeData,
  treeDataSelector,
} from "#/store/reducers/structures/treeNodeReducer";
import { ArgumentType } from "#/utils/argumentObject";

const overlayStyles = {
  content: "''",
  height: "100%",
  width: "32px",
  position: "absolute",
  pointerEvents: "none",
  top: 0,
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

  const treeState = useAppSelector(treeDataSelector);
  const arrayState = useAppSelector(arrayDataSelector);

  // Archer container forced re-render after animations hack
  useEffect(() => {
    const timeoutId = setTimeout(() => setForceUpdate((prev) => !prev), 50);

    return () => clearTimeout(timeoutId);
  }, [treeState]);

  useArgumentsParsing();

  useNodesRuntimeUpdates(playbackInterval, replayCount);

  const scrollRef = useRef<HTMLElement>() as React.Ref<HTMLElement>;
  const [, setForceUpdate] = useState(false);
  const [scrolledStart, setScrolledStart] = useState(true);
  const [scrolledEnd, setScrolledEnd] = useState(true);

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
  }, [treeState]);

  useEffect(() => {
    const handler = () => {
      handleScroll();
    };
    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, []);

  const binaryTrees = useMemo(() => {
    let prevTree: TreeData | null = null;
    let leftOffset = 0;
    let verticalCount = 0;
    return Object.entries(treeState)
      .sort(([, { order: a }], [, { order: b }]) => a - b)
      .map(([treeName, data]) => {
        const style: React.CSSProperties = { left: 0 };
        if (data.type === ArgumentType.BINARY_TREE) {
          if (prevTree?.type === ArgumentType.BINARY_TREE) {
            leftOffset += 200 + prevTree.maxDepth ** 5.3;
          }
          style.left = leftOffset;
          style.top = verticalCount * 72;
        } else {
          style.top = verticalCount * 72;
          verticalCount++;
          leftOffset = 0;
        }
        prevTree = data;
        return (
          <NodesView
            key={treeName}
            treeName={treeName}
            data={data}
            style={style}
          />
        );
      });
  }, [treeState]);

  const arrayStructures = useMemo(() => {
    if (!arrayState) return null;

    const sorted = Object.entries(arrayState).sort(
      ([, { order: a }], [, { order: b }]) => a - b
    );
    const arrayNodes = [];

    for (const [arrayName, data] of sorted) {
      if (data.argType === ArgumentType.MATRIX) {
        arrayNodes.push(
          <MatrixStructureView
            key={arrayName}
            data={data}
            arrayState={arrayState}
          />
        );
      } else if (!data.parentName) {
        arrayNodes.push(<ArrayStructureView key={arrayName} data={data} />);
      }
    }

    return arrayNodes;
  }, [arrayState]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      rowGap={1}
      borderRadius={1}
      position="relative"
      width="100%"
      height="100%"
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
      <ScrollContainer
        innerRef={scrollRef}
        onScroll={handleScroll}
        style={{ height: "100%" }}
      >
        <Box
          sx={{
            height: "100%",
            m: 3,
            path: {
              transition: "fill 0.3s",
            },
          }}
        >
          <ArcherContainer
            lineStyle="straight"
            strokeColor={alpha(theme.palette.primary.dark, 0.5)}
            strokeWidth={4}
            endMarker={false}
            style={{
              height: "100%",
            }}
            svgContainerStyle={{
              overflow: "visible",
              height: "100%",
            }}
          >
            {arrayStructures && (
              <Stack width="fit-content" spacing={2}>
                {arrayStructures}
              </Stack>
            )}
            {binaryTrees && <Box height="100%">{binaryTrees}</Box>}
          </ArcherContainer>
        </Box>
      </ScrollContainer>
    </Box>
  );
};
