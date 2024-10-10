import React from "react";

import { NodeBase } from "#/components/molecules/TreeViewer/NodeBase";
import { useBinaryChildNodes, useNodeColors } from "#/hooks";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { editorSlice, selectIsEditing } from "#/store/reducers/editorReducer";
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

  const isEditing = useAppSelector(selectIsEditing);
  const { nodeColor, shadowColor } = useNodeColors(color);

  const { relations } = useBinaryChildNodes(props, nodeColor);

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (ev) => {
    if (!isEditing) return;

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
      cursor={isEditing ? "grab" : "pointer"}
      animation={isEditing ? "pulse" : animation}
      animationCount={isEditing ? 1 : animationCount}
      {...props}
    />
  );
};
