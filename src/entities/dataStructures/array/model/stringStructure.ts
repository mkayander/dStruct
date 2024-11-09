import type { EntityState } from "@reduxjs/toolkit";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { makeArrayBaseClass } from "#/entities/dataStructures/array/model/arrayBase";
import { type ArrayItemData } from "#/entities/dataStructures/array/model/arraySlice";
import { initControlledArray } from "#/entities/dataStructures/array/model/arrayStructure";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";
import { uuid } from "#/shared/lib";

import { generateArrayData } from "../lib/generateArrayData";

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

export const getRuntimeString = (callstack: CallstackHelper) =>
  class StringProxy extends ControlledString {
    constructor(input?: unknown) {
      let string = String(input);
      if (input === undefined) string = "";
      const data = generateArrayData(string.split(""));
      super(string, uuid.generate(), data, callstack, true);
    }
  };
