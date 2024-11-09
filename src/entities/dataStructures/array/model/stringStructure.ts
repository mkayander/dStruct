import type { EntityState } from "@reduxjs/toolkit";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { makeArrayBaseClass } from "#/entities/dataStructures/array/model/arrayBase";
import { initControlledArray } from "#/entities/dataStructures/array/model/arrayStructure";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";

const ArrayBase = makeArrayBaseClass(String);

export class ControlledString extends ArrayBase {
  private readonly itemsMeta!: ArrayItemData[];

  constructor(
    value: unknown,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
  ) {
    super(value);

    return initControlledArray(
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
