import type { EntityState } from "@reduxjs/toolkit";
import { generate } from "short-uuid";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { generateArrayData } from "#/entities/dataStructures/array/lib/generateArrayData";
import { makeArrayBaseClass } from "#/entities/dataStructures/array/model/arrayBase";
import { type ArrayItemData } from "#/entities/dataStructures/array/model/arraySlice";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";

const ArrayBase = makeArrayBaseClass(Object);

export class ControlledObject extends ArrayBase {
  [key: string]: any;

  private nextIndex!: number;
  private itemsMeta!: Map<any, ArrayItemData>;

  constructor(
    value: any,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    super(value);
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
        value: new Map(),
        enumerable: false,
      },
      nextIndex: {
        value: 0,
        enumerable: false,
        writable: true,
      },
      argType: {
        value: ArgumentType.OBJECT,
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

    return new Proxy(this, {
      get: (target, prop) => {
        if (prop === "toJSON") {
          return () => value;
        }

        if (globalThis.recordReads !== false) {
          const key = String(prop);
          if (this.itemsMeta.has(key)) {
            this.blink(key);
          }
        }

        return Reflect.get(target, prop);
      },
      set: (target, prop, value) => {
        const isSuccessful = Reflect.set(target, prop, value);
        if (isSuccessful) {
          this.updateItem(value, this.nextIndex++, String(prop));
        }

        return isSuccessful;
      },
    });
  }

  protected getNodeMeta(key: any): ArrayItemData | undefined {
    return this.itemsMeta.get(key);
  }

  protected setNodeMeta(key: any, data: ArrayItemData): void {
    this.itemsMeta.set(key, data);
  }
}

export const getRuntimeObject = (callstack: CallstackHelper) =>
  class ObjectProxy extends ControlledObject {
    constructor(input?: any) {
      const data = generateArrayData([]);
      super(input, generate(), data, callstack, true);
    }
  };
