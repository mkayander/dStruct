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
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { editorSlice, selectDragState } from "#/store/reducers/editorReducer";
import { arrayDataSelector } from "#/store/reducers/structures/arrayReducer";
import {
  type TreeData,
  treeDataSelector,
  treeDataStructuresSelector,
  treeNodeSlice,
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
  const dispatch = useAppDispatch();

  const treeState = useAppSelector(treeDataSelector);
  const arrayState = useAppSelector(arrayDataSelector);
  const treeStructures = useAppSelector(treeDataStructuresSelector);
  const dragState = useAppSelector(selectDragState);

  // Archer container forced re-render after animations hack
  useEffect(() => {
    handleScroll();
    const timeoutId = setTimeout(() => setForceUpdate((prev) => !prev), 50);

    return () => clearTimeout(timeoutId);
  }, [treeState]);

  useArgumentsParsing();

  useNodesRuntimeUpdates(playbackInterval, replayCount);

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
    const handler = () => {
      handleScroll();
    };
    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, []);

  const binaryTrees = useMemo(() => {
    let prevTree: TreeData | null = null;
    let topOffset = 0;
    return treeStructures.binaryTree.map(({ name, treeState }) => {
      const style: React.CSSProperties = {
        top: topOffset,
        left: 0,
      };

      style.top = 0;
      if (prevTree) {
        style.left = (Number(style.left) || 0) + 200 + prevTree.maxDepth ** 5.3;
      }
      topOffset += treeState.maxDepth * 72;

      prevTree = treeState;
      return (
        <NodesView key={name} treeName={name} data={treeState} style={style} />
      );
    });
  }, [treeStructures.binaryTree]);

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
      } else if (
        data.argType === ArgumentType.MATRIX ||
        (data.argType === ArgumentType.ARRAY && data.hasNested)
      ) {
        arrayNodes.push(
          <MatrixStructureView
            key={arrayName}
            data={data}
            arrayState={arrayState}
          />,
        );
      } else {
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
      onMouseLeave={() => {
        if (dragState) dispatch(editorSlice.actions.clear());
      }}
      onMouseUp={() => {
        if (dragState) dispatch(editorSlice.actions.clear());
      }}
      onMouseMove={(ev: React.MouseEvent) => {
        if (!dragState) return;

        dispatch(
          treeNodeSlice.actions.dragNode({
            ...dragState,
            clientX: ev.clientX,
            clientY: ev.clientY,
          }),
        );
      }}
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
        vertical={!dragState}
        horizontal={!dragState}
        onScroll={handleScroll}
        style={{ height: "100%", flexGrow: 1 }}
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
            {treeStructures.graph && (
              <Box height="100%" position="absolute">
                {treeStructures.graph.map(({ name, treeState }) => (
                  <NodesView key={name} treeName={name} data={treeState} />
                ))}
              </Box>
            )}
            {arrayStructures && (
              <Stack width="fit-content" minWidth="100%" spacing={2}>
                {arrayStructures}
                <br />

                {treeStructures.linkedList.map(({ name, treeState }) => (
                  <NodesView
                    key={name}
                    treeName={name}
                    data={treeState}
                    sx={{
                      position: "relative",
                      height: "42px",
                    }}
                  />
                ))}
              </Stack>
            )}
            {binaryTrees && <Box height="100%">{binaryTrees}</Box>}
          </ArcherContainer>
        </Box>
      </ScrollContainer>
    </Box>
  );
};
