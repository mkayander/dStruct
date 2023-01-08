import { useCallback, useMemo } from 'react';

import { isNumber } from '#/utils';
import uuid4 from 'short-uuid';
import { useDispatch } from 'react-redux';
import { treeNodeSlice } from '#/store/reducers/treeNodeReducer';

// [3,9,20,null,null,15,7]

// const input: BinaryTreeInput = [1, 2, 2, 3, 3, null, null, 4, 4];

export type BinaryTreeInput = (number | null)[];

type NodeMeta = {
  id: string;
  depth: number;
  isRoot?: boolean;
  maxDepth?: number;
  rootNode?: BinaryTreeNode;
};

export class BinaryTreeNode {
  meta: NodeMeta;

  constructor(
    readonly val: number,
    public left: BinaryTreeNode | null = null,
    public right: BinaryTreeNode | null = null,
    meta: NodeMeta
  ) {
    this.meta = meta;
  }
}

export const useBinaryTree = (
  input?: BinaryTreeInput
): BinaryTreeNode | null => {
  const dispatch = useDispatch();

  const createChildNode = useCallback((value: number | null | undefined, meta: Partial<NodeMeta>) => {
    if (!isNumber(value)) return null;

    const newNode = new BinaryTreeNode(value, null, null, <NodeMeta>{ id: uuid4.generate(), ...meta });

    dispatch(treeNodeSlice.actions.add({
      id: newNode.meta.id,
      value: newNode.val
    }));

    return newNode;
  }, [dispatch]);

  return useMemo(() => {
    if (!input || input.length === 0) return null;

    dispatch(treeNodeSlice.actions.clearAll());

    const rootNum = input[0];
    if (!isNumber(rootNum)) return null;

    const root = createChildNode(rootNum, { depth: 0, isRoot: true });
    if (!root) return null;

    const queue: BinaryTreeNode[] = [root];

    let i = 1;

    while (queue.length > 0 && i < input.length) {
      const current = queue.shift();
      if (!current) break;

      const newDepth = current.meta.depth + 1;

      const metaProps: Partial<NodeMeta> = {
        depth: newDepth,
        rootNode: root
      };

      root.meta.maxDepth = newDepth;

      current.left = createChildNode(input[i], metaProps);
      current.left && queue.push(current.left);
      i++;

      current.right = createChildNode(input[i], metaProps);
      current.right && queue.push(current.right);
      i++;
    }

    return root;
  }, [createChildNode, dispatch, input]);
};
