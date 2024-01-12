"use client";

import { alpha, Box, Stack, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArcherContainer } from "react-archer";
import ScrollContainer from "react-indiana-drag-scroll";

import { ArrayStructureView } from "#/components/molecules/TreeViewer/ArrayStructureView";
import { MapStructureView } from "#/components/molecules/TreeViewer/MapStructureView";
import { MatrixStructureView } from "#/components/molecules/TreeViewer/MatrixStructureView";
import { NodesView } from "#/components/molecules/TreeViewer/NodesView";
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
  frameState: [number, React.Dispatch<React.SetStateAction<number>>];
  playbackInterval: number;
  replayCount: number;
};

export const TreeViewer: React.FC<TreeViewerProps> = ({
  frameState,
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

  useNodesRuntimeUpdates(frameState, playbackInterval, replayCount);

  const scrollRef = useRef<HTMLElement>(null);
  const [, setForceUpdate] = useState(false);
  const [scrolledStart, setScrolledStart] = useState(true);
  const [scrolledEnd, setScrolledEnd] = useState(true);

  const handleScroll = () => {
    const current = scrollRef.current;
    if (!current) return;
    const offset = 10;

    setScrolledStart(current.scrollLeft <= offset);
    setScrolledEnd(
      current.scrollLeft + current.offsetWidth >= current.scrollWidth - offset,
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
    let topOffset = 0;
    let leftOffset = 0;
    return Object.entries(treeState)
      .sort(([, { order: a }], [, { order: b }]) => a - b)
      .map(([treeName, data]) => {
        const style: React.CSSProperties = {
          top: topOffset,
          left: leftOffset,
        };
        if (data.type === ArgumentType.BINARY_TREE) {
          style.top = 0;
          if (prevTree?.type === ArgumentType.BINARY_TREE) {
            style.left =
              (Number(style.left) || 0) + 200 + prevTree.maxDepth ** 5.3;
          }
          topOffset += data.maxDepth * 72;
        } else {
          leftOffset = 0;
          topOffset += 72;
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

    const sorted = Object.entries(arrayState)
      .filter(([, item]) => !item.isNested)
      .sort(([, { order: a }], [, { order: b }]) => a - b);
    const arrayNodes = [];

    for (const [arrayName, data] of sorted) {
      if (
        data.argType === ArgumentType.MAP ||
        data.argType === ArgumentType.OBJECT
      ) {
        arrayNodes.push(<MapStructureView key={arrayName} data={data} />);
      } else if (data.argType === ArgumentType.MATRIX) {
        arrayNodes.push(
          <MatrixStructureView
            key={arrayName}
            data={data}
            arrayState={arrayState}
          />,
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
      sx={{
        flexGrow: 1,
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
