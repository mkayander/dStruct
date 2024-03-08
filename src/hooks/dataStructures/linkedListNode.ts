import { type BinaryNodeMeta } from "#/hooks/dataStructures/binaryTreeNode";
import { NodeBase, type NodeMeta } from "#/hooks/dataStructures/nodeBase";
import type { CallstackHelper } from "#/store/reducers/callstackReducer";
import { type TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";
import { ArgumentType } from "#/utils/argumentObject";
import { safeStringify } from "#/utils/stringifySolutionResult";

export class LinkedListNode<T extends number | string> extends NodeBase<T> {
  constructor(
    val: T,
    next: LinkedListNode<T> | null = null,
    meta: NodeMeta,
    name: string,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
  ) {
    super(val, meta, name, callstack);
    this._next = next;

    if (addToCallstack) {
      this.callstack.addOne({
        ...this.getDispatchBase(),
        name: "addNode",
        args: { value: safeStringify(val) },
      });
    }
  }

  _next: LinkedListNode<T> | null;

  public get next() {
    this.meta.displayTraversal && this.setColor("cyan", "blink");
    return this._next;
  }

  public set next(node: LinkedListNode<T> | null) {
    this._next = node;
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "setNextNode",
      args: { childId: node?.meta.id ?? null, childTreeName: node?.name },
    });
    if (node) {
      node.name = this.name;
    }
  }

  static fromNodeData(
    name: string,
    nodeData: TreeNodeData | undefined,
    dataMap: Record<string, TreeNodeData>,
    callstack: CallstackHelper,
    meta?: Partial<BinaryNodeMeta>,
  ): LinkedListNode<number | string> | null {
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

    const newNode = new LinkedListNode(
      value ?? "",
      null,
      newMeta,
      name,
      callstack,
    );

    if (nextId) {
      newNode.next = LinkedListNode.fromNodeData(
        name,
        dataMap[nextId],
        dataMap,
        callstack,
        meta,
      );
    }

    return newNode;
  }

  public delete() {
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "deleteNode",
    });
  }
}
