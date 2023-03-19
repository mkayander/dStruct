import { createRuntimeBinaryTree } from "#/hooks/dataStructures/binaryTreeNode";
import type { AppDispatch } from "#/store/makeStore";
import type { ArgumentObject } from "#/store/reducers/caseReducer";
import type { TreeDataState } from "#/store/reducers/treeNodeReducer";

export const createCaseRuntimeArgs = (
  dispatch: AppDispatch,
  treeStore: TreeDataState,
  args: ArgumentObject[]
) => {
  return args.map((arg) => {
    switch (arg.type) {
      case "binaryTree":
        const nodesData = treeStore[arg.name];
        if (!nodesData) {
          console.error("No nodes data found for binary tree", arg.name);
          return null;
        }
        return createRuntimeBinaryTree(nodesData, arg.name, dispatch);

      case "number":
        return Number(arg.input);

      case "string":
        return arg.input;

      case "boolean":
        return arg.input === "true";

      case "array":
        return JSON.parse(arg.input) as number[];
    }
  });
};
