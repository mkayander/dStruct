import { Queue } from "@datastructures-js/queue";
import shortUUID from "short-uuid";

import { BinaryTreeNode } from "#/hooks/dataStructures/binaryTreeNode";
import { LinkedListNode } from "#/hooks/dataStructures/linkedListNode";
import { type AppDispatch } from "#/store/makeStore";
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
        "candidate",
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
        "candidate",
        dispatch,
        true
      );
    }
  }

  const context = {
    Queue,
    BinaryTree,
    LinkedList,
  };

  Object.assign(window, context);
};
