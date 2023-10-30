import type { Dictionary } from "@reduxjs/toolkit";

import { NodeBase, type NodeMeta } from "#/hooks/dataStructures/nodeBase";
import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import type { TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";
import { ArgumentType } from "#/utils/argumentObject";

export interface BinaryNodeMeta extends NodeMeta {
  depth: number;
  isRoot?: boolean;
  isLeaf?: boolean;
  maxDepth?: number;
  rootNode?: BinaryTreeNode;
}

export class BinaryTreeNode extends NodeBase {
  constructor(
    val: number | string,
    left: BinaryTreeNode | null = null,
    right: BinaryTreeNode | null = null,
    meta: BinaryNodeMeta,
    name: string,
    dispatch: AppDispatch,
    addToCallstack?: boolean,
  ) {
    super(val, meta, name, dispatch);
    Object.defineProperties(this, {
      _left: {
        value: left,
        enumerable: false,
      },
      _right: {
        value: right,
        enumerable: false,
      },
    });

    if (addToCallstack) {
      this.dispatch(
        callstackSlice.actions.addOne({
          ...this.getDispatchBase(),
          name: "addNode",
          args: [val],
        }),
      );
    }
  }

  private _left!: BinaryTreeNode | null;

  public get left() {
    this.meta.displayTraversal && this.setColor("cyan", "blink");
    return this._left;
  }

  public set left(node: BinaryTreeNode | null) {
    this._left = node;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setLeftChild",
        args: [node?.meta.id ?? null, node?.name],
      }),
    );
  }

  private _right!: BinaryTreeNode | null;

  public get right() {
    this.meta.displayTraversal && this.setColor("cyan", "blink");
    return this._right;
  }

  public set right(node: BinaryTreeNode | null) {
    this._right = node;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setRightChild",
        args: [node?.meta.id ?? null, node?.name],
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
}
