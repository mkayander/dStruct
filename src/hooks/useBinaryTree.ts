import { useMemo } from 'react';

import { isNumber } from '#/utils';

// [3,9,20,null,null,15,7]

// const input: BinaryTreeInput = [1, 2, 2, 3, 3, null, null, 4, 4];

export type BinaryTreeInput = (number | null)[];

type NodeMeta = {
  depth: number;
  isRoot?: boolean;
  maxDepth?: number;
  rootNode?: BinaryTreeNode;
};

export class BinaryTreeNode {
  meta: NodeMeta;

  constructor(
    readonly value: number,
    public left: BinaryTreeNode | null = null,
    public right: BinaryTreeNode | null = null,
    meta: NodeMeta = { depth: 0 }
  ) {
    this.meta = meta;
  }
}

const createChildNode = (value: number | null | undefined, meta: NodeMeta) => {
  if (!isNumber(value)) return null;
  console.log('createChildNode', value, meta);
  return new BinaryTreeNode(value, null, null, meta);
};

const buildBinaryTree = (input?: BinaryTreeInput): BinaryTreeNode | null => {
  if (!input || input.length === 0) return null;

  const rootNum = input[0];
  if (!isNumber(rootNum)) return null;
  const root = new BinaryTreeNode(rootNum, null, null, {
    depth: 0,
    isRoot: true,
  });
  const queue: BinaryTreeNode[] = [root];

  let i = 1;

  while (queue.length > 0 && i < input.length) {
    const current = queue.shift();
    if (!current) break;

    const newDepth = current.meta.depth + 1;

    const metaProps: NodeMeta = {
      depth: newDepth,
      rootNode: root,
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
};

export const useBinaryTree = (
  input?: BinaryTreeInput
): BinaryTreeNode | null => {
  return useMemo(() => buildBinaryTree(input), [input]);
};
