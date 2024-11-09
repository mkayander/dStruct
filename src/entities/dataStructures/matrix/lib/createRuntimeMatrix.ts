import { isArgumentArrayType } from "#/entities/argument/lib";
import type { ArgumentObject } from "#/entities/argument/model/types";
import { createRuntimeArray } from "#/entities/dataStructures/array/lib";
import type { ArrayDataState } from "#/entities/dataStructures/array/model/arraySlice";
import { ControlledArray } from "#/entities/dataStructures/array/model/arrayStructure";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";
import { getMatrixChildArrayArgs } from "#/features/treeViewer/hooks/useArgumentsParsing";

export const createRuntimeMatrix = (
  arrayStore: ArrayDataState,
  arg: ArgumentObject,
  callstack: CallstackHelper,
) => {
  const nodeData = arrayStore[arg.name];
  if (!isArgumentArrayType(arg) || !nodeData) return null;

  const children = getMatrixChildArrayArgs(arg).map((child) =>
    createRuntimeArray(arrayStore[child.name], child, callstack),
  );

  const matrix = new ControlledArray(
    children,
    arg.name,
    nodeData.nodes,
    callstack,
  );

  return matrix;
};
