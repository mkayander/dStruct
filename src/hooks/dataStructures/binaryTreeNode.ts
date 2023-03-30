import type { Dictionary } from "@reduxjs/toolkit";
import shortUUID from "short-uuid";

import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import type {
  BinaryTreeNodeData,
  TreeData,
} from "#/store/reducers/treeNodeReducer";

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
  private _right: BinaryTreeNode | null;

  constructor(
    val: number | string,
    left: BinaryTreeNode | null = null,
    right: BinaryTreeNode | null = null,
    meta: NodeMeta,
    private name: string,
    private dispatch: AppDispatch
  ) {
    this._val = val;
    this._left = left;
    this._right = right;
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

  private _left: BinaryTreeNode | null;

  public get left() {
    return this._left;
  }

  public set left(value: BinaryTreeNode | null) {
    this._left = value;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setLeftChild",
        args: [value?.meta.id ?? null],
      })
    );
  }

  public get right() {
    return this._right;
  }

  public set right(value: BinaryTreeNode | null) {
    this._right = value;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setRightChild",
        args: [value?.meta.id ?? null],
      })
    );
  }

  static fromNodeData(
    name: string,
    nodeData: BinaryTreeNodeData | undefined,
    dataMap: Dictionary<BinaryTreeNodeData>,
    dispatch: AppDispatch,
    meta?: Partial<NodeMeta>
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
          newMeta
        )
      : null;
    const rightNode = right
      ? BinaryTreeNode.fromNodeData(
          name,
          dataMap[right],
          dataMap,
          dispatch,
          newMeta
        )
      : null;

    if (!leftNode && !rightNode) {
      newMeta.isLeaf = true;
    }

    return new BinaryTreeNode(
      value,
      leftNode,
      rightNode,
      { ...newMeta, id },
      name,
      dispatch
    );
  }

  public setColor(color: string | null, animation?: string) {
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setColor",
        args: [color, animation],
      })
    );
  }

  public blink() {
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "blink",
        args: [],
      })
    );
  }

  private getDispatchBase() {
    return {
      id: uuid.generate(),
      treeName: this.name,
      nodeId: this.meta.id,
      timestamp: performance.now(),
    };
  }
}

export const createRuntimeBinaryTree = (
  nodesData: TreeData,
  name: string,
  dispatch: AppDispatch
) => {
  const rootId = nodesData.rootId;
  if (!rootId) return null;

  let dataMap = nodesData.nodes.entities;
  if (nodesData.initialNodes.ids.length > 0) {
    dataMap = nodesData.initialNodes.entities;
  }

  const rootData = dataMap[rootId];

  return BinaryTreeNode.fromNodeData(name, rootData, dataMap, dispatch);
};
