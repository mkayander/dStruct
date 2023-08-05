import { PriorityQueue } from "@datastructures-js/priority-queue";
import { Queue } from "@datastructures-js/queue";
import shortUUID from "short-uuid";

import {
  ControlledArray,
  type ControlledArrayRuntimeOptions,
} from "#/hooks/dataStructures/arrayStructure";
import { BinaryTreeNode } from "#/hooks/dataStructures/binaryTreeNode";
import { LinkedListNode } from "#/hooks/dataStructures/linkedListNode";
import { ControlledString } from "#/hooks/dataStructures/stringStructure";
import { type AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import { generateArrayData } from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";
import { safeStringify, stripQuotes } from "#/utils/stringifySolutionResult";

const uuid = shortUUID();

export const setGlobalRuntimeContext = (dispatch: AppDispatch) => {
  class BinaryTree extends BinaryTreeNode {
    constructor(
      val: number,
      left: BinaryTreeNode | null = null,
      right: BinaryTreeNode | null = null
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
        dispatch,
        true
      );
    }
  }

  class LinkedList extends LinkedListNode {
    constructor(val: number, next: LinkedListNode | null = null) {
      super(
        val,
        next,
        {
          id: uuid.generate(),
          type: ArgumentType.LINKED_LIST,
        },
        uuid.generate(),
        dispatch,
        true
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

      super(items, uuid.generate(), data, dispatch, true);
    }

    static override from(
      array: Array<number | string>,
      mapFn?: (
        item: number | string | undefined,
        index: number
      ) => number | string,
      thisArg?: unknown,
      options?: ControlledArrayRuntimeOptions
    ) {
      return ControlledArray._from(dispatch, array, mapFn, thisArg, options);
    }
  }

  class StringProxy extends ControlledString {
    constructor(input?: unknown) {
      let string = String(input);
      if (input === undefined) string = "";
      const data = generateArrayData(string.split(""));
      super(string, uuid.generate(), data, dispatch, true);
    }
  }

  const context = {
    ArrayProxy,
    StringProxy,
    Queue,
    PriorityQueue,
    BinaryTree,
    LinkedList,
    ListNode: LinkedList,
    log: (...args: unknown[]) => {
      dispatch(
        callstackSlice.actions.addOne({
          id: uuid.generate(),
          timestamp: performance.now(),
          name: "consoleLog",
          args: args.map((arg) => {
            if (typeof arg === "object") {
              return stripQuotes(safeStringify(arg));
            }
            return String(arg);
          }),
        })
      );

      console.log(...args);
    },
  };

  Object.assign(window, context);
};
