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

  const rootData = nodesData.nodes.entities[rootId];

  return BinaryTreeNode.fromNodeData(
    rootData,
    nodesData.nodes.entities,
    dispatch
  );
};
