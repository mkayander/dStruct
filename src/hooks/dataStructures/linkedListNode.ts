import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { NodeBase, type NodeMeta } from "#/hooks/dataStructures/nodeBase";
import { safeStringify } from "#/shared/lib/stringifySolutionResult";
import type { CallstackHelper } from "#/store/reducers/callstackReducer";
import { type TreeNodeData } from "#/store/reducers/structures/treeNodeReducer";

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
    return this._next;
  }

  public set next(node: LinkedListNode<T> | null) {
    const prevNode = this._next;
    this._next = node;
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "setNextNode",
      args: { childId: node?.meta.id ?? null, childTreeName: node?.name },
      prevArgs: {
        childId: prevNode?.meta.id ?? null,
        childTreeName: prevNode?.name,
      },
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
    meta?: Partial<NodeMeta>,
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
