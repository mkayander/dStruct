import { Queue } from "@datastructures-js/queue";
import type { Dictionary } from "@reduxjs/toolkit";

import { NodeBase, type NodeMeta } from "#/hooks/dataStructures/nodeBase";
import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import type { TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";
import { ArgumentType } from "#/utils/argumentObject";

export interface BinaryNodeMeta<T extends number | string = number | string>
  extends NodeMeta {
  depth: number;
  isRoot?: boolean;
  isLeaf?: boolean;
  maxDepth?: number;
  rootNode?: BinaryTreeNode<T>;
}

export class BinaryTreeNode<
  T extends number | string = number | string,
> extends NodeBase<T> {
  constructor(
    value: T,
    left: BinaryTreeNode<T> | null = null,
    right: BinaryTreeNode<T> | null = null,
    meta: BinaryNodeMeta<T>,
    name: string,
    dispatch: AppDispatch,
    addToCallstack?: boolean,
  ) {
    super(value, meta, name, dispatch);
    Object.defineProperties(this, {
      _left: {
        value: left,
        enumerable: false,
        writable: true,
      },
      _right: {
        value: right,
        enumerable: false,
        writable: true,
      },
    });

    if (addToCallstack) {
      this.dispatch(
        callstackSlice.actions.addOne({
          ...this.getDispatchBase(),
          name: "addNode",
          args: { value },
        }),
      );
    }
  }

  private _left!: BinaryTreeNode<T> | null;

  public get left() {
    this.meta.displayTraversal && this.setColor("cyan", "blink");
    return this._left;
  }

  public set left(node: BinaryTreeNode<T> | null) {
    this._left = node;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setLeftChild",
        args: { childId: node?.meta.id ?? null, childTreeName: node?.name },
      }),
    );
  }

  private _right!: BinaryTreeNode<T> | null;

  public get right() {
    this.meta.displayTraversal && this.setColor("cyan", "blink");
    return this._right;
  }

  public set right(node: BinaryTreeNode<T> | null) {
    this._right = node;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setRightChild",
        args: { childId: node?.meta.id ?? null, childTreeName: node?.name },
      }),
    );
  }

  static fromNodeData(
    name: string,
    nodeData: TreeNodeData | undefined,
    dataMap: Dictionary<TreeNodeData>,
    dispatch: AppDispatch,
    meta?: Partial<BinaryNodeMeta>,
  ): BinaryTreeNode | null {
    if (!nodeData) return null;

    const {
      id,
      value,
      childrenIds: [left, right],
    } = nodeData;

    const newMeta = {
      ...meta,
      depth: (meta?.depth ?? -1) + 1,
    };

    const leftNode = left
      ? BinaryTreeNode.fromNodeData(
          name,
          dataMap[left],
          dataMap,
          dispatch,
          newMeta,
        )
      : null;
    const rightNode = right
      ? BinaryTreeNode.fromNodeData(
          name,
          dataMap[right],
          dataMap,
          dispatch,
          newMeta,
        )
      : null;

    if (!leftNode && !rightNode) {
      newMeta.isLeaf = true;
    }

    return new BinaryTreeNode(
      value,
      leftNode,
      rightNode,
      { ...newMeta, id, type: ArgumentType.BINARY_TREE },
      name,
      dispatch,
    );
  }

  public toString(): string {
    const result = [];
    const queue: Queue<BinaryTreeNode<T> | null> = new Queue();
    queue.enqueue(this);

    while (!queue.isEmpty()) {
      const node = queue.dequeue();

      result.push(node?.val ?? "null");

      if (node) {
        queue.enqueue(node.left);
        queue.enqueue(node.right);
      }
    }

    while (result.at(-1) === "null") result.pop();

    return `Binary Tree [${String(result)}]`;
  }
}
