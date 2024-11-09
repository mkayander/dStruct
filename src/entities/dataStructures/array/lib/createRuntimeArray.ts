import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentObject } from "#/entities/argument/model/types";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";

import type { ArrayData } from "../model/arraySlice";
import { ControlledArray } from "../model/arrayStructure";
import { ControlledString } from "../model/stringStructure";

export const createRuntimeArray = (
  nodesData: ArrayData | undefined,
  arg: ArgumentObject,
  callstack: CallstackHelper,
) => {
  if (!nodesData) return null;

  let arrayDataState = nodesData.nodes;
  if (nodesData.initialNodes !== null) {
    arrayDataState = nodesData.initialNodes;
  }

  arrayDataState = structuredClone(arrayDataState);

  if (nodesData.argType === ArgumentType.STRING) {
    return new ControlledString(arg.input, arg.name, arrayDataState, callstack);
  }

  const array = JSON.parse(arg.input) as Array<number | string>;
  return new ControlledArray(array, arg.name, arrayDataState, callstack);
};
