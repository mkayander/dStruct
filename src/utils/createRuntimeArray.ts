import { ControlledArray } from "#/hooks/dataStructures/arrayStructure";
import type { AppDispatch } from "#/store/makeStore";
import type { ArrayData } from "#/store/reducers/structures/arrayReducer";
import type { ArgumentObject } from "#/utils/argumentObject";

export const createRuntimeArray = (
  nodesData: ArrayData | undefined,
  arg: ArgumentObject,
  dispatch: AppDispatch
) => {
  if (!nodesData) return null;
  const array = JSON.parse(arg.input) as Array<number | string>;

  let arrayDataState = nodesData.nodes;
  if (nodesData.initialNodes !== null) {
    arrayDataState = nodesData.initialNodes;
  }

  arrayDataState = structuredClone(arrayDataState);

  return new ControlledArray(array, arg.name, arrayDataState, dispatch);
};
