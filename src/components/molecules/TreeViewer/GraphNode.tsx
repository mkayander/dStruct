import React from "react";

import { NodeBase } from "#/components/molecules/TreeViewer/NodeBase";
import { useBinaryChildNodes, useNodeColors } from "#/hooks";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  editorSlice,
  selectIsEditingNodes,
} from "#/store/reducers/editorReducer";
import { type TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";
import { type ArgumentTreeType } from "#/utils/argumentObject";

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

  const { relations } = useBinaryChildNodes(props, nodeColor);

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
      relations={relations}
      onMouseDown={handleMouseDown}
      cursor={isEditingNodes ? "grab" : "pointer"}
      animation={isEditingNodes ? "pulse" : animation}
      animationCount={isEditingNodes ? 1 : animationCount}
      {...props}
    />
  );
};
