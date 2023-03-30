import React from "react";

import { NodeBase } from "#/components/TreeViewer/NodeBase";
import { useBinaryChildNodes, useNodeColors } from "#/hooks";
import { type TreeNodeData } from "#/store/reducers/treeNodeReducer";
import { type ArgumentTreeType } from "#/utils/argumentObject";

export type BinaryNodeProps = TreeNodeData & {
  treeName: string;
  type: ArgumentTreeType;
};

export const BinaryNode: React.FC<BinaryNodeProps> = (props) => {
  const { color } = props;

  const { nodeColor, shadowColor } = useNodeColors(color);

  const { relations } = useBinaryChildNodes(props, nodeColor);

  return (
    <NodeBase
      nodeColor={nodeColor}
      shadowColor={shadowColor}
      relations={relations}
      {...props}
    />
  );
};
