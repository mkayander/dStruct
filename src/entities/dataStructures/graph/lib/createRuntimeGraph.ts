import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentObject } from "#/entities/argument/model/types";
import type { TreeData } from "#/entities/dataStructures/node/model/nodeSlice";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";

import { ControlledGraphArray } from "../model/graphArray";

export const createRuntimeGraph = (
  nodesData: TreeData | undefined,
  arg: ArgumentObject,
  callstack: CallstackHelper,
) => {
  if (arg.type !== ArgumentType.GRAPH || !nodesData) return null;

  const input = JSON.parse(arg.input);

  return new ControlledGraphArray(input, arg.name, nodesData.nodes, callstack);
};
