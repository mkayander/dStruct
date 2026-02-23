import type { EntityState } from "@reduxjs/toolkit";
import { generate } from "short-uuid";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { generateArrayData } from "#/entities/dataStructures/array/lib/generateArrayData";
import { makeArrayBaseClass } from "#/entities/dataStructures/array/model/arrayBase";
import {
  arrayDataItemSelectors,
  type ArrayItemData,
} from "#/entities/dataStructures/array/model/arraySlice";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";

const ArrayBase = makeArrayBaseClass(Map);

export class ControlledMap extends ArrayBase {
  private nextIndex!: number;
  private itemsMeta!: Map<any, ArrayItemData>;

  constructor(
    entries: any[] | null | undefined,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    super(entries);
    Object.defineProperties(this, {
      name: {
        value: name,
        enumerable: false,
      },
      structureType: {
        value: "array",
        enumerable: false,
      },
      itemsMeta: {
        value: new Map(
          arrayDataItemSelectors
            .selectAll(arrayData)
            .map((item) => [item.value, item]),
        ),
        enumerable: false,
      },
      nextIndex: {
        value: 0,
        enumerable: false,
        writable: true,
      },
      argType: {
        value: ArgumentType.MAP,
        enumerable: false,
      },
      callstack: {
        value: callstack,
        enumerable: false,
      },
    });

    if (addToCallstack) {
      this.callstack.addOne({
        ...this.getDispatchBase(),
        name: "addArray",
        args: { arrayData },
      });
    }
  }

  override get(key: any) {
    const value = super.get(key);

    if (globalThis.recordReads !== false) {
      this.blink(key);
    }

    return value;
  }

  override set(key: any, value: any) {
    super.set(key, value);

    this.updateItem(value, this.nextIndex++, key);

    return this;
  }

  override delete(key: any) {
    if (!super.has(key)) return false;

    const base = this.getDispatchBase(key);
    super.delete(key);
    this.callstack.addOne({
      ...base,
      name: "deleteNode",
    });

    return true;
  }

  protected getNodeMeta(key: any): ArrayItemData | undefined {
    return this.itemsMeta.get(key);
  }

  protected setNodeMeta(key: any, data: ArrayItemData): void {
    this.itemsMeta.set(key, data);
  }
}

export const getRuntimeMap = (callstack: CallstackHelper) =>
  class MapProxy extends ControlledMap {
    constructor(input?: any[] | null) {
      const map = new Map(input);
      const data = generateArrayData(Array.from(map));
      super(Array.from(map), generate(), data, callstack, true);
    }
  };
