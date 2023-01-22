import { useEffect } from 'react';
import uuid4 from 'short-uuid';

import { isNumber } from '#/utils';

import { useAppDispatch } from '#/store/hooks';
import { callstackSlice } from '#/store/reducers/callstackReducer';
import {
  type BinaryTreeNodeDataPayload,
  treeNodeSlice,
} from '#/store/reducers/treeNodeReducer';

// [3,9,20,null,null,15,7]

export type BinaryTreeInput = (number | null)[];

export const useBinaryTree = (input?: BinaryTreeInput) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!input || input.length === 0) return;

    const newDataNodes: Record<string, BinaryTreeNodeDataPayload> = {};

    const createNodeData = (
      value: number | undefined | null,
      depth: number
    ) => {
      if (!isNumber(value)) return;

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
    if (!isNumber(rootNum)) return;

    const rootData = createNodeData(rootNum, 0);
    if (!rootData) return;

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

    dispatch(
      treeNodeSlice.actions.addMany({
        maxDepth,
        nodes: Object.values(newDataNodes),
      })
    );

    dispatch(callstackSlice.actions.removeAll());
  }, [dispatch, input]);
};
