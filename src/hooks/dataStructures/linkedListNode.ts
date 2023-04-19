import { type Dictionary } from "@reduxjs/toolkit";

import { type BinaryNodeMeta } from "#/hooks/dataStructures/binaryTreeNode";
import { NodeBase, type NodeMeta } from "#/hooks/dataStructures/nodeBase";
import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import { type TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";
import { ArgumentType } from "#/utils/argumentObject";

export class LinkedListNode extends NodeBase {
  constructor(
    val: number | string,
    next: LinkedListNode | null = null,
    meta: NodeMeta,
    name: string,
    dispatch: AppDispatch,
    addToCallstack?: boolean
  ) {
    super(val, meta, name, dispatch);
    this._next = next;

    if (addToCallstack) {
      this.dispatch(
        callstackSlice.actions.addOne({
          ...this.getDispatchBase(),
          name: "addNode",
          args: [val],
        })
      );
      console.log("added to callstack", this);
    }
  }

  _next: LinkedListNode | null;

  public get next() {
    this.meta.displayTraversal && this.setColor("cyan", "blink");
    return this._next;
  }

  public set next(node: LinkedListNode | null) {
    this._next = node;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setNextNode",
        args: [node?.meta.id ?? null, node?.name],
      })
    );
    if (node) {
      node.name = this.name;
    }
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

    const newMeta = {
      ...meta,
      id,
      type: ArgumentType.LINKED_LIST,
    } satisfies NodeMeta;

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
