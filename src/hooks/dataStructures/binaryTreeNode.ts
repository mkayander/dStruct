import type { Dictionary } from "@reduxjs/toolkit";
import shortUUID from "short-uuid";

import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import type { BinaryTreeNodeData } from "#/store/reducers/treeNodeReducer";

const uuid = shortUUID();

export type NodeMeta = {
  id: string;
  depth: number;
  isRoot?: boolean;
  isLeaf?: boolean;
  maxDepth?: number;
  rootNode?: BinaryTreeNode;
};

export class BinaryTreeNode {
  meta: NodeMeta;

  constructor(
    val: number | string,
    public left: BinaryTreeNode | null = null,
    public right: BinaryTreeNode | null = null,
    meta: NodeMeta,
    private dispatch: AppDispatch
  ) {
    this._val = val;
    this.meta = meta;
  }

  private _val: number | string;

  public get val(): number | string {
    return this._val;
  }

  public set val(value: number | string) {
    this._val = value;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setVal",
        args: [value],
      })
    );
  }

  static fromNodeData(
    nodeData: BinaryTreeNodeData | undefined,
    dataMap: Dictionary<BinaryTreeNodeData>,
    dispatch: AppDispatch,
    meta?: Partial<NodeMeta>
  ): BinaryTreeNode | null {
    if (!nodeData) return null;

    const { id, originalValue, left, right } = nodeData;

    const newMeta = {
      ...meta,
      depth: (meta?.depth ?? -1) + 1,
    };

    const leftNode = left
      ? BinaryTreeNode.fromNodeData(dataMap[left], dataMap, dispatch, newMeta)
      : null;
    const rightNode = right
      ? BinaryTreeNode.fromNodeData(dataMap[right], dataMap, dispatch, newMeta)
      : null;

    if (!leftNode && !rightNode) {
      newMeta.isLeaf = true;
    }

    return new BinaryTreeNode(
      originalValue,
      leftNode,
      rightNode,
      { ...newMeta, id },
      dispatch
    );
  }

  public setColor(color: string | null) {
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setColor",
        args: [color],
      })
    );
  }

  private getDispatchBase() {
    return {
      id: uuid.generate(),
      nodeId: this.meta.id,
      timestamp: performance.now(),
    };
  }
}
