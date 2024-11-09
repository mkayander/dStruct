import { Queue } from "@datastructures-js/queue";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import {
  NodeBase,
  type NodeMeta,
} from "#/entities/dataStructures/node/model/nodeBase";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";
import type { TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";

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
    callstack: CallstackHelper,
    addToCallstack?: boolean,
  ) {
    super(value, meta, name, callstack);
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
      this.callstack.addOne({
        ...this.getDispatchBase(),
        name: "addNode",
        args: { value },
      });
    }
  }

  private _left!: BinaryTreeNode<T> | null;

  public get left() {
    return this._left;
  }

  public set left(node: BinaryTreeNode<T> | null) {
    const prevNode = this._left;
    this._left = node;
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "setLeftChild",
      args: { childId: node?.meta.id ?? null, childTreeName: node?.name },
      prevArgs: {
        childId: prevNode?.meta.id ?? null,
        childTreeName: prevNode?.name,
      },
    });
  }

  private _right!: BinaryTreeNode<T> | null;

  public get right() {
    return this._right;
  }

  public set right(node: BinaryTreeNode<T> | null) {
    const prevNode = this._right;
    this._right = node;
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "setRightChild",
      args: { childId: node?.meta.id ?? null, childTreeName: node?.name },
      prevArgs: {
        childId: prevNode?.meta.id ?? null,
        childTreeName: prevNode?.name,
      },
    });
  }

  static fromNodeData(
    name: string,
    nodeData: TreeNodeData | undefined,
    dataMap: Record<string, TreeNodeData>,
    callstack: CallstackHelper,
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
          callstack,
          newMeta,
        )
      : null;
    const rightNode = right
      ? BinaryTreeNode.fromNodeData(
          name,
          dataMap[right],
          dataMap,
          callstack,
          newMeta,
        )
      : null;

    if (!leftNode && !rightNode) {
      newMeta.isLeaf = true;
    }

    return new BinaryTreeNode(
      value ?? "",
      leftNode,
      rightNode,
      { ...newMeta, id, type: ArgumentType.BINARY_TREE },
      name,
      callstack,
    );
  }

  public toString(): string {
    const result = [];
    const queue: Queue<BinaryTreeNode<T> | null> = new Queue();
    queue.enqueue(this);
    const circularRefs = new Map();

    const recordReads = globalThis.recordReads;
    globalThis.recordReads = false;
    while (!queue.isEmpty()) {
      const node = queue.dequeue();

      result.push(node?.val ?? "null");

      if (node) {
        if (circularRefs.has(node)) {
          result.push(`Circular Ref to ${circularRefs.get(node)}`);
          continue;
        }
        circularRefs.set(node.left, node.val);
        queue.enqueue(node.left);
        queue.enqueue(node.right);
      }
    }
    globalThis.recordReads = recordReads;

    while (result.at(-1) === "null") result.pop();

    return `Binary Tree [${String(result)}]`;
  }
}
