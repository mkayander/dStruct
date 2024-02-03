import type { EntityState } from "@reduxjs/toolkit";

import { makeArrayBaseClass } from "#/hooks/dataStructures/arrayBase";
import { initControlledArray } from "#/hooks/dataStructures/arrayStructure";
import type { CallstackHelper } from "#/store/reducers/callstackReducer";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";

const ArrayBase = makeArrayBaseClass(String);

export class ControlledString extends ArrayBase {
  private readonly itemsMeta!: ArrayItemData[];

  constructor(
    value: unknown,
    name: string,
    arrayData: EntityState<ArrayItemData>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
  ) {
    super(value);

    initControlledArray(
      this,
      arrayData,
      name,
      callstack,
      addToCallstack,
      undefined,
      ArgumentType.STRING,
    );
  }

  protected getNodeMeta(key: number): ArrayItemData | undefined {
    return this.itemsMeta.at(key);
  }

  protected setNodeMeta(key: number, meta: ArrayItemData): void {
    this.itemsMeta[key] = meta;
  }
}
