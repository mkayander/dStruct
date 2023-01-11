import { useMemo } from 'react';
import uuid4 from 'short-uuid';

import { BinaryTreeNode } from '#/hooks/dataTypes/binaryTreeNode';
import { isNumber } from '#/utils';

import { useAppDispatch } from '#/store/hooks';
import { callstackSlice } from '#/store/reducers/callstackReducer';
import {
  type BinaryTreeNodeDataPayload,
  treeNodeSlice,
} from '#/store/reducers/treeNodeReducer';

// [3,9,20,null,null,15,7]

// const input: BinaryTreeInput = [1, 2, 2, 3, 3, null, null, 4, 4];

export type BinaryTreeInput = (number | null)[];

export const useBinaryTree = (
  input?: BinaryTreeInput
): BinaryTreeNode | null => {
  const dispatch = useAppDispatch();

  return useMemo(() => {
    if (!input || input.length === 0) return null;

    const newDataNodes: Record<string, BinaryTreeNodeDataPayload> = {};

    const createNodeData = (
      value: number | undefined | null,
      depth: number
    ) => {
      if (!isNumber(value)) return null;

      const newId = uuid4.generate();
      newDataNodes[newId] = {
        id: newId,
        value: value,
        depth,
      };

      return newDataNodes[newId];
    };

    dispatch(treeNodeSlice.actions.clearAll());

    const rootNum = input[0];
    if (!isNumber(rootNum)) return null;

    const rootData = createNodeData(rootNum, 0);
    if (!rootData) return null;

    const queue: BinaryTreeNodeDataPayload[] = [rootData];

    let maxDepth = 0;

    let i = 1;

    while (queue.length > 0 && i < input.length) {
      const current = queue.shift();
      if (!current) break;

      const newDepth = current.depth + 1;

      maxDepth = newDepth;

      const newLeft = createNodeData(input[i], newDepth);
      if (newLeft) {
        current.left = newLeft.id;
        queue.push(newLeft);
      }
      i++;

      const newRight = createNodeData(input[i], newDepth);
      if (newRight) {
        current.right = newRight.id;
        queue.push(newRight);
      }
      i++;
    }

    const root = BinaryTreeNode.fromNodeData(rootData, newDataNodes, dispatch);
    if (!root) return null;

    root.meta.isRoot = true;

    dispatch(
      treeNodeSlice.actions.addMany({
        maxDepth,
        nodes: Object.values(newDataNodes),
      })
    );

    dispatch(callstackSlice.actions.removeAll());

    return root;
  }, [dispatch, input]);
};

// export const useReduxBinaryTree = () => {
//   const {
//     rootId,
//     nodes: { entities: nodesMap },
//   } = useAppSelector(treeDataSelector);
//   const rootNodeData = useAppSelector(selectNodeDataById(rootId || ''));
//
//   return useMemo(() => {
//     if (!rootNodeData) return null;
//
//     const root = BinaryTreeNode.fromNodeData(rootNodeData, nodesMap);
//     if (!root) return null;
//
//     root.meta.isRoot = true;
//
//     return root;
//   }, [nodesMap, rootNodeData]);
// };
