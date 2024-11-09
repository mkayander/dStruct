import type { EntityState } from "@reduxjs/toolkit";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";
import { makeArrayBaseClass } from "#/hooks/dataStructures/arrayBase";
import { initControlledArray } from "#/hooks/dataStructures/arrayStructure";
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
