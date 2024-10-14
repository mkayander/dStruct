import type { EntityState } from "@reduxjs/toolkit";

import { makeArrayBaseClass } from "#/hooks/dataStructures/arrayBase";
import type { CallstackHelper } from "#/store/reducers/callstackReducer";
import {
  arrayDataItemSelectors,
  type ArrayItemData,
} from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";

const ArrayBase = makeArrayBaseClass(Set);

export class ControlledSet extends ArrayBase {
  private nextIndex!: number;
  private itemsMeta!: Map<any, ArrayItemData>;
  private isInitialized?: boolean;

  constructor(
    value: any[] | null | undefined,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
  ) {
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
        value: ArgumentType.SET,
        enumerable: false,
      },
      callstack: {
        value: callstack,
        enumerable: false,
      },
      isInitialized: {
        value: true,
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

  override add(value: any) {
    if (super.has(value)) return this;

    super.add(value);

    if (this.isInitialized) {
      this.updateItem(value, this.nextIndex++, value);
    }

    return this;
  }

  override delete(value: any) {
    if (!super.has(value)) return false;

    const base = this.getDispatchBase(value);
    super.delete(value);
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
