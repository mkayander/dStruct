import { PriorityQueue } from "@datastructures-js/priority-queue";
import shortUUID from "short-uuid";

import {
  ControlledArray,
  type ControlledArrayRuntimeOptions,
} from "#/hooks/dataStructures/arrayStructure";
import { BinaryTreeNode } from "#/hooks/dataStructures/binaryTreeNode";
import { LinkedListNode } from "#/hooks/dataStructures/linkedListNode";
import { ControlledMap } from "#/hooks/dataStructures/mapStructure";
import { ControlledObject } from "#/hooks/dataStructures/objectStructure";
import { ControlledSet } from "#/hooks/dataStructures/setStructure";
import { ControlledString } from "#/hooks/dataStructures/stringStructure";
import {
  ControlledBigInt64Array,
  ControlledBigUint64Array,
  ControlledFloat32Array,
  ControlledFloat64Array,
  ControlledInt16Array,
  ControlledInt32Array,
  ControlledUint8Array,
  ControlledUint8ClampedArray,
  ControlledUint16Array,
  ControlledUint32Array,
} from "#/hooks/dataStructures/typedArrayStructure";
import type { CallstackHelper } from "#/store/reducers/callstackReducer";
import { generateArrayData } from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";
import { safeStringify, stripQuotes } from "#/utils/stringifySolutionResult";

const uuid = shortUUID();

const generateTypedArrayData = (size: number) =>
  generateArrayData(new Array(size).fill(0));

export const setGlobalRuntimeContext = (callstack: CallstackHelper) => {
  class BinaryTree extends BinaryTreeNode {
    constructor(
      val: number,
      left: BinaryTreeNode | null = null,
      right: BinaryTreeNode | null = null,
    ) {
      super(
        val,
        left,
        right,
        {
          id: uuid.generate(),
          type: ArgumentType.BINARY_TREE,
          depth: 0,
        },
        uuid.generate(),
        callstack,
        true,
      );
    }
  }

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
  }

  class ArrayProxy<T extends string | number> extends ControlledArray<T> {
    constructor(arrayLength: number);
    constructor(...items: Array<T>) {
      if (items.length === 1 && typeof items[0] === "number") {
        const arrayLength = items[0];
        items = new Array(arrayLength);
      }

      if (
        items[0] &&
        typeof items[0] !== "number" &&
        typeof items[0] !== "string"
      ) {
        throw new Error("ArrayProxy can only contain numbers or strings");
      }

      const data = generateArrayData(items);

      super(items, uuid.generate(), data, callstack, true);
    }

    static override from(
      array: Array<number | string>,
      mapFn?: (
        item: number | string | undefined,
        index: number,
      ) => number | string,
      thisArg?: unknown,
      options?: ControlledArrayRuntimeOptions,
    ) {
      return ControlledArray._from(callstack, array, mapFn, thisArg, options);
    }
  }

  class Uint32ArrayProxy extends ControlledUint32Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  }

  class Int32ArrayProxy extends ControlledInt32Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  }

  class Uint16ArrayProxy extends ControlledUint16Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  }

  class Int16ArrayProxy extends ControlledInt16Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  }

  class Uint8ArrayProxy extends ControlledUint8Array {
    constructor(size: number) {
      const data = generateArrayData(new Array(size).fill(0));
      super(size, uuid.generate(), data, callstack, true);
    }
  }

  class Uint8ClampedArrayProxy extends ControlledUint8ClampedArray {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  }

  class Float32ArrayProxy extends ControlledFloat32Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  }

  class Float64ArrayProxy extends ControlledFloat64Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  }

  class BigInt64ArrayProxy extends ControlledBigInt64Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  }

  class BigUint64ArrayProxy extends ControlledBigUint64Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  }

  class StringProxy extends ControlledString {
    constructor(input?: unknown) {
      let string = String(input);
      if (input === undefined) string = "";
      const data = generateArrayData(string.split(""));
      super(string, uuid.generate(), data, callstack, true);
    }
  }

  class SetProxy extends ControlledSet {
    constructor(input?: any[] | null) {
      const set = new Set(input);
      const data = generateArrayData(Array.from(set));
      super(Array.from(set), uuid.generate(), data, callstack, true);
    }
  }

  class MapProxy extends ControlledMap {
    constructor(input?: any[] | null) {
      const map = new Map(input);
      const data = generateArrayData(Array.from(map));
      super(Array.from(map), uuid.generate(), data, callstack, true);
    }
  }

  class ObjectProxy extends ControlledObject {
    constructor(input?: any) {
      const data = generateArrayData([]);
      super(input, uuid.generate(), data, callstack, true);
    }
  }

  class Queue<T extends number | string> {
    private head: LinkedList<T> | null = null;
    private tail: LinkedList<T> | null = null;
    private _size = 0;

    constructor(elements?: T[]) {
      if (elements) {
        for (const element of elements) {
          this.enqueue(element);
        }
      }
    }

    enqueue(element: T): Queue<T> {
      const node = new LinkedList(element);
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
  }

  const context = {
    ArrayProxy,
    Uint32ArrayProxy,
    Int32ArrayProxy,
    Uint16ArrayProxy,
    Int16ArrayProxy,
    Uint8ArrayProxy,
    Uint8ClampedArrayProxy,
    Float32ArrayProxy,
    Float64ArrayProxy,
    BigInt64ArrayProxy,
    BigUint64ArrayProxy,
    StringProxy,
    SetProxy,
    MapProxy,
    ObjectProxy,
    Queue,
    PriorityQueue,
    BinaryTree,
    LinkedList,
    ListNode: LinkedList,
    log: (...args: unknown[]) => {
      callstack.addOne({
        id: uuid.generate(),
        timestamp: performance.now(),
        name: "consoleLog",
        args: args.map((arg) => {
          if (typeof arg === "object") {
            return stripQuotes(safeStringify(arg));
          }
          return String(arg);
        }),
      });

      console.log(...args);
    },
  };

  Object.assign(self, context);
};

export const globalDefinitionsPrefix = `
  const console = {...self.console, log: self.log, error: self.error, warn: self.warn, info: self.info};
  const Array = self.ArrayProxy;
  const Uint32Array = self.Uint32ArrayProxy;
  const Int32Array = self.Int32ArrayProxy;
  const Uint16Array = self.Uint16ArrayProxy;
  const Int16Array = self.Int16ArrayProxy;
  const Uint8Array = self.Uint8ArrayProxy;
  const Uint8ClampedArray = self.Uint8ClampedArrayProxy;
  const Float32Array = self.Float32ArrayProxy;
  const Float64Array = self.Float64ArrayProxy;
  const BigInt64Array = self.BigInt64ArrayProxy;
  const BigUint64Array = self.BigUint64ArrayProxy;
  const String = self.StringProxy;
  const Set = self.SetProxy;
  const Map = self.MapProxy;
  const Object = self.ObjectProxy;
`.trim();
export const codePrefixLinesCount = globalDefinitionsPrefix.split("\n").length;
