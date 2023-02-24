import { useMemo } from "react";

import { BinaryTreeNode } from "#/hooks/dataStructures/binaryTreeNode";
import { useAppDispatch, useAppSelector } from "#/store/hooks";
import type { AppDispatch } from "#/store/makeStore";
import {
  treeDataSelector,
  type TreeDataState,
} from "#/store/reducers/treeNodeReducer";

export const useRuntimeBinaryTree = () => {
  const dispatch = useAppDispatch();

  const nodesData = useAppSelector(treeDataSelector);

  return useMemo(
    () => createRuntimeTree(nodesData, dispatch),
    [nodesData, dispatch]
  );
};

export const createRuntimeTree = (
  nodesData: TreeDataState,
  dispatch: AppDispatch
) => {
  const rootId = nodesData.rootId;
  if (!rootId) return null;

  let dataMap = nodesData.nodes.entities;
  if (nodesData.initialNodes.ids.length > 0) {
    dataMap = nodesData.initialNodes.entities;
  }

  const rootData = dataMap[rootId];

  return BinaryTreeNode.fromNodeData(rootData, dataMap, dispatch);
};
