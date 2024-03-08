import type { EntityState } from "@reduxjs/toolkit";

import { makeArrayBaseClass } from "#/hooks/dataStructures/arrayBase";
import type { CallstackHelper } from "#/store/reducers/callstackReducer";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";

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
      set: (target, key, value) => {
        key = String(key);
        target[key as any] = value;

        this.updateItem(value, this.nextIndex++, key);

        return true;
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
