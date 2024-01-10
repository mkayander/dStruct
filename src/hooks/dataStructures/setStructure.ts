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

const uuid = shortUUID();

const ArrayBase = makeArrayBaseClass(Set);

export class ControlledSet extends ArrayBase {
  private nextIndex!: number;
  private itemsMeta!: Map<any, ArrayItemData>;

  constructor(
    value: any[] | null | undefined,
    name: string,
    arrayData: EntityState<ArrayItemData>,
    dispatch: AppDispatch,
    addToCallstack?: boolean,
  ) {
    super(value);
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
        value: ArgumentType.SET,
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

  override add(value: any) {
    if (super.has(value)) return this;

    super.add(value);
    const index = this.nextIndex++;
    const newItem = {
      id: uuid.generate(),
      index,
      value,
    };
    this.dispatch(
      callstackSlice.actions.addOne({
        id: uuid.generate(),
        argType: this.argType,
        treeName: this.name,
        structureType: "array",
        nodeId: newItem.id,
        timestamp: performance.now(),
        name: "addArrayItem",
        args: { value, index },
      }),
    );
    this.itemsMeta.set(value, newItem);
    return this;
  }

  override delete(value: any) {
    if (!super.has(value)) return false;

    const base = this.getDispatchBase(value);
    super.delete(value);
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
