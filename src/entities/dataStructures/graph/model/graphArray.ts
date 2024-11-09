import { type EntityState } from "@reduxjs/toolkit";

import { makeArrayBaseClass } from "#/entities/dataStructures/array/model/arrayBase";
import {
  type TreeNodeData,
  treeNodeDataSelector,
} from "#/entities/dataStructures/node/model/nodeSlice";
import { type CallstackHelper } from "#/features/callstack/model/callstackSlice";

type ArrayContent = Array<string | number>;

const BaseClass = makeArrayBaseClass(Array);

export class ControlledGraphArray extends BaseClass {
  readonly callstack!: CallstackHelper;
  protected readonly name!: string;
  private readonly itemsMeta!: Map<string | number, TreeNodeData>;

  constructor(
    array: ArrayContent,
    name: string,
    graphData: EntityState<TreeNodeData, string>,
    callstack: CallstackHelper,
  ) {
    super();
    this.push(...array);

    Object.defineProperties(this, {
      name: {
        value: name,
        enumerable: false,
      },
      structureType: {
        value: "treeNode",
        enumerable: false,
      },
      itemsMeta: {
        value: new Map(
          treeNodeDataSelector
            .selectAll(graphData)
            .map((item) => [item.value, item]),
        ),
        enumerable: false,
      },
      callstack: {
        value: callstack,
        enumerable: false,
      },
    });
  }

  protected getNodeMeta(key: number): TreeNodeData | undefined {
    return this.itemsMeta.get(key);
  }

  protected setNodeMeta(key: any, data: TreeNodeData): void {
    this.itemsMeta.set(key, data);
  }
}
