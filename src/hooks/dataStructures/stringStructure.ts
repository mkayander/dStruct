import type { EntityState } from "@reduxjs/toolkit";

import { makeArrayBaseClass } from "#/hooks/dataStructures/arrayBase";
import type { CallstackHelper } from "#/store/reducers/callstackReducer";
import {
  arrayDataItemSelectors,
  type ArrayItemData,
} from "#/store/reducers/structures/arrayReducer";
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
    Object.defineProperties(this, {
      name: {
        value: name,
        enumerable: false,
      },
      itemsMeta: {
        value: arrayDataItemSelectors.selectAll(arrayData),
        enumerable: false,
      },
      argType: {
        value: ArgumentType.STRING,
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

  protected getNodeMeta(key: number): ArrayItemData | undefined {
    return this.itemsMeta.at(key);
  }

  protected setNodeMeta(key: number, meta: ArrayItemData): void {
    this.itemsMeta[key] = meta;
  }
}
