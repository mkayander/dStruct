import { useMemo } from "react";

import { BinaryTreeNode } from "#/hooks/dataStructures/binaryTreeNode";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import { treeDataSelector } from "#/store/reducers/treeNodeReducer";

export const useRuntimeBinaryTree = () => {
  const dispatch = useAppDispatch();

  const nodesData = useAppSelector(treeDataSelector);

  return useMemo(() => {
    const rootId = nodesData.rootId;
    if (!rootId) return null;

    const rootData = nodesData.nodes.entities[rootId];

    return BinaryTreeNode.fromNodeData(
      rootData,
      nodesData.nodes.entities,
      dispatch
    );
  }, [nodesData, dispatch]);
};
