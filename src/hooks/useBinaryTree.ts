import { useMemo } from 'react';

// [3,9,20,null,null,15,7]

// const input: BinaryTreeInput = [1, 2, 2, 3, 3, null, null, 4, 4];

export type BinaryTreeInput = (number | null)[];

export class BinaryTreeNode {
  value: number;
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;

  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function buildBinaryTree(input?: BinaryTreeInput): BinaryTreeNode | null {
  if (!input || input.length === 0) return null;

  const root = new BinaryTreeNode(input[0]!);
  const queue: BinaryTreeNode[] = [root];

  let i = 1;

  while (queue.length > 0 && i < input.length) {
    const current = queue.shift();
    if (!current) break;

    const leftNum = input[i];
    if (leftNum) {
      current.left = new BinaryTreeNode(leftNum);
      queue.push(current.left);
    }

    const rightNum = input[++i];
    if (rightNum) {
      current.right = new BinaryTreeNode(rightNum);
      queue.push(current.right);
    }
    i++;
  }
  return root;
}

export const useBinaryTree = (
  input?: BinaryTreeInput
): BinaryTreeNode | null => {
  return useMemo(() => buildBinaryTree(input), [input]);
};
