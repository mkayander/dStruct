import { Queue } from "@datastructures-js/queue";
import shortUUID from "short-uuid";

import { ControlledArray } from "#/hooks/dataStructures/arrayStructure";
import { BinaryTreeNode } from "#/hooks/dataStructures/binaryTreeNode";
import { LinkedListNode } from "#/hooks/dataStructures/linkedListNode";
import { type AppDispatch } from "#/store/makeStore";
import { generateArrayData } from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";

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
        dispatch
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

    static override from(array: Array<number | string>) {
      const data = generateArrayData(array);
      return new ControlledArray(array, uuid.generate(), data, dispatch, true);
    }
  }

  const context = {
    ArrayProxy,
    Queue,
    BinaryTree,
    LinkedList,
  };

  Object.assign(window, context);
};
