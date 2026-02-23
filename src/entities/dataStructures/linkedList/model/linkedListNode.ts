import uuid from "short-uuid";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import {
  NodeBase,
  type NodeMeta,
} from "#/entities/dataStructures/node/model/nodeBase";
import { type TreeNodeData } from "#/entities/dataStructures/node/model/nodeSlice";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";
import { safeStringify } from "#/shared/lib/stringifySolutionResult";

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

export const getRuntimeLinkedListClass = (callstack: CallstackHelper) =>
  class LinkedList<T extends number | string> extends LinkedListNode<T> {
    constructor(val: T, next: LinkedListNode<T> | null = null) {
      super(
        val,
        next,
        {
          id: uuid.generate(),
          type: ArgumentType.LINKED_LIST,
        },
        uuid.generate(),
        callstack,
        true,
      );
    }
  };

export const getRuntimeQueueClass = (
  LinkedListClass: ReturnType<typeof getRuntimeLinkedListClass>,
) =>
  class Queue<T extends number | string> {
    private head: LinkedListNode<T> | null = null;
    private tail: LinkedListNode<T> | null = null;
    private _size = 0;

    constructor(elements?: T[]) {
      if (elements) {
        for (const element of elements) {
          this.enqueue(element);
        }
      }
    }

    enqueue(element: T): Queue<T> {
      const node = new LinkedListClass(element);
      if (!this.head) {
        this.head = this.tail = node;
      } else if (this.tail) {
        this.tail.next = node;
        this.tail = this.tail.next;
      }
      this._size++;
      return this;
    }

    dequeue(): T | null {
      if (!this.head) return null;

      const node = this.head;
      if (node === this.tail) {
        this.tail = this.head = null;
      } else {
        this.head = this.head.next;
      }

      this._size--;
      node.delete();
      return node.val;
    }

    front(): T | null {
      return this.head?.val ?? null;
    }

    back(): T | null {
      return this.tail?.val ?? null;
    }

    isEmpty(): boolean {
      return !this.head;
    }

    size(): number {
      return this._size;
    }

    toArray(): T[] {
      const arr: T[] = [];
      let current = this.head;
      while (current) {
        arr.push(current.val);
        current = current.next;
      }

      return arr;
    }
  };
