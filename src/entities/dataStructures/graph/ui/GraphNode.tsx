import React from "react";

import type { ArgumentTreeType } from "#/entities/argument/model/types";
import { type TreeNodeData } from "#/entities/dataStructures/node/model/nodeSlice";
import {
  editorSlice,
  selectIsEditingNodes,
} from "#/features/treeViewer/model/editorSlice";
import { NodeBase } from "#/features/treeViewer/ui/NodeBase";
import { useNodeColors } from "#/shared/hooks";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

export type GraphNodeProps = TreeNodeData & {
  treeName: string;
  type: ArgumentTreeType;
};

export const GraphNode: React.FC<GraphNodeProps> = ({
  color,
  animation,
  animationCount,
  ...props
}) => {
  const dispatch = useAppDispatch();

  const isEditingNodes = useAppSelector(selectIsEditingNodes);
  const { nodeColor, shadowColor } = useNodeColors(color);

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (ev) => {
    if (!isEditingNodes) return;

    ev.stopPropagation();
    dispatch(
      editorSlice.actions.startDrag({
        treeName: props.treeName,
        nodeId: props.id,
        startX: props.x,
        startY: props.y,
        startClientX: ev.clientX,
        startClientY: ev.clientY,
      }),
    );
  };

  return (
    <NodeBase
      nodeColor={nodeColor}
      shadowColor={shadowColor}
      onMouseDown={handleMouseDown}
      cursor={isEditingNodes ? "grab" : "pointer"}
      animation={isEditingNodes ? "pulse" : animation}
      animationCount={isEditingNodes ? 1 : animationCount}
      {...props}
    />
  );
};
