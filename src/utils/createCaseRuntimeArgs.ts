import { Prisma } from "@prisma/client";

import type { AppDispatch } from "#/store/makeStore";
import type { TreeDataState } from "#/store/reducers/structures/treeNodeReducer";
import { type ArgumentObject, ArgumentType } from "#/utils/argumentObject";
import { createRuntimeTree } from "#/utils/createRuntimeTree";

import JsonArray = Prisma.JsonArray;

export const createCaseRuntimeArgs = (
  dispatch: AppDispatch,
  treeStore: TreeDataState,
  args: ArgumentObject[]
) => {
  return args.map((arg) => {
    switch (arg.type) {
      case ArgumentType.LINKED_LIST:
      case ArgumentType.BINARY_TREE:
        const nodesData = treeStore[arg.name];
        if (!nodesData) {
          console.error("No nodes data found for binary tree", arg.name);
          return null;
        }
        return createRuntimeTree(nodesData, arg.name, dispatch);

      case ArgumentType.NUMBER:
        return Number(arg.input);

      case ArgumentType.STRING:
        return arg.input;

      case ArgumentType.BOOLEAN:
        return arg.input === "true";

      case ArgumentType.ARRAY:
        return JSON.parse(arg.input) as JsonArray;

      case ArgumentType.MATRIX:
        return JSON.parse(arg.input) as number[][];
    }
  });
};
