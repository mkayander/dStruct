import type { EntityState } from "@reduxjs/toolkit";
import shortUUID from "short-uuid";

import { makeArrayBaseClass } from "#/hooks/dataStructures/arrayBase";
import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import {
  arrayDataItemSelectors,
  type ArrayItemData,
} from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";
import { safeStringify } from "#/utils/stringifySolutionResult";

const uuid = shortUUID();

const ArrayBase = makeArrayBaseClass(Map);

export class ControlledMap extends ArrayBase {
  private nextIndex!: number;
  private itemsMeta!: Map<any, ArrayItemData>;

  constructor(
    entries: any[] | null | undefined,
    name: string,
    arrayData: EntityState<ArrayItemData>,
    dispatch: AppDispatch,
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
      dispatch: {
        value: dispatch,
        enumerable: false,
      },
    });

    if (addToCallstack) {
      this.dispatch(
        callstackSlice.actions.addOne({
          ...this.getDispatchBase(),
          name: "addArray",
          args: { arrayData },
        }),
      );
    }
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
    this.dispatch(
      callstackSlice.actions.addOne({
        ...base,
        name: "deleteNode",
      }),
    );

    return true;
  }

  protected getNodeMeta(key: any): ArrayItemData | undefined {
    return this.itemsMeta.get(key);
  }
}
