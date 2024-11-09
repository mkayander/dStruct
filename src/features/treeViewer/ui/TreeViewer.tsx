"use client";

import { Box, Stack } from "@mui/material";
import React, { useMemo } from "react";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { ArrayStructureView } from "#/entities/dataStructures/array/ui/ArrayStructureView";
import { MapStructureView } from "#/entities/dataStructures/map/ui/MapStructureView";
import { MatrixStructureView } from "#/entities/dataStructures/matrix/ui/MatrixStructureView";
import {
  editorSlice,
  selectNodeDragState,
} from "#/features/treeViewer/model/editorSlice";
import { NodesView } from "#/features/treeViewer/ui/NodesView";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { arrayDataSelector } from "#/store/reducers/structures/arrayReducer";
import {
  type TreeData,
  treeDataStructuresSelector,
  treeNodeSlice,
} from "#/store/reducers/structures/treeNodeReducer";

import { useArgumentsParsing, useNodesRuntimeUpdates } from "../hooks";

type TreeViewerProps = {
  playbackInterval: number;
  replayCount: number;
};

export const TreeViewer: React.FC<TreeViewerProps> = ({
  playbackInterval,
  replayCount,
}) => {
  const dispatch = useAppDispatch();

  const arrayState = useAppSelector(arrayDataSelector);
  const treeStructures = useAppSelector(treeDataStructuresSelector);
  const nodeDragState = useAppSelector(selectNodeDragState);

  useArgumentsParsing();

  useNodesRuntimeUpdates(playbackInterval, replayCount);

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
      minHeight="100%"
      width="100%"
      onMouseLeave={() => {
        if (nodeDragState) dispatch(editorSlice.actions.clear());
      }}
      onMouseUp={() => {
        if (nodeDragState) dispatch(editorSlice.actions.clear());
      }}
      onMouseMove={(ev: React.MouseEvent) => {
        if (!nodeDragState) return;

        dispatch(
          treeNodeSlice.actions.dragNode({
            ...nodeDragState,
            clientX: ev.clientX,
            clientY: ev.clientY,
          }),
        );
      }}
      sx={{
        flexGrow: 1,
      }}
    >
      {binaryTrees.length ? <Box height="100%">{binaryTrees}</Box> : null}

      {treeStructures.graph.map(({ name, treeState }) => (
        <NodesView key={name} treeName={name} data={treeState} />
      ))}

      {arrayStructures?.length || treeStructures.linkedList.length ? (
        <Stack width="fit-content" minWidth="100%" m={2} spacing={2}>
          {arrayStructures}
          <br />

          {treeStructures.linkedList.map(({ name, treeState }) => {
            if (!treeState.nodes.ids.length) return null;

            return (
              <NodesView
                key={name}
                treeName={name}
                data={treeState}
                sx={{
                  position: "relative",
                  height: "42px",
                }}
              />
            );
          })}
        </Stack>
      ) : null}
    </Box>
  );
};
