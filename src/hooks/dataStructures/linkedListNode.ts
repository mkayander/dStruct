import { type Dictionary } from "@reduxjs/toolkit";

import { type BinaryNodeMeta } from "#/hooks/dataStructures/binaryTreeNode";
import { NodeBase, type NodeMeta } from "#/hooks/dataStructures/nodeBase";
import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import { type TreeNodeData } from "#/store/reducers/treeNodeReducer";

export class LinkedListNode extends NodeBase {
  constructor(
    val: number | string,
    next: LinkedListNode | null = null,
    meta: NodeMeta,
    name: string,
    dispatch: AppDispatch
  ) {
    super(val, meta, name, dispatch);
    this._next = next;
  }

  private _next: LinkedListNode | null;

  public get next() {
    this.meta.displayTraversal && this.setColor("cyan", "blink");
    return this._next;
  }

  public set next(value: LinkedListNode | null) {
    this._next = value;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setNextNode",
        args: [value?.meta.id ?? null],
      })
    );
  }

  static fromNodeData(
    name: string,
    nodeData: TreeNodeData | undefined,
    dataMap: Dictionary<TreeNodeData>,
    dispatch: AppDispatch,
    meta?: Partial<BinaryNodeMeta>
  ): LinkedListNode | null {
    if (!nodeData) return null;

    const {
      id,
      value,
      childrenIds: [nextId],
    } = nodeData;

    const newMeta = { ...meta, id, displayTraversal: true };

    const newNode = new LinkedListNode(value, null, newMeta, name, dispatch);

    if (nextId) {
      newNode.next = LinkedListNode.fromNodeData(
        name,
        dataMap[nextId],
        dataMap,
        dispatch,
        meta
      );
    }

    return newNode;
  }
}
