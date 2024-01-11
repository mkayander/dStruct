import type { EntityState } from "@reduxjs/toolkit";
import shortUUID from "short-uuid";

import { makeArrayBaseClass } from "#/hooks/dataStructures/arrayBase";
import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";
import { safeStringify } from "#/utils/stringifySolutionResult";

const uuid = shortUUID();

const ArrayBase = makeArrayBaseClass(Object);

export class ControlledObject extends ArrayBase {
  [key: string]: any;

  private nextIndex!: number;
  private itemsMeta!: Map<any, ArrayItemData>;

  constructor(
    value: any,
    name: string,
    arrayData: EntityState<ArrayItemData>,
    dispatch: AppDispatch,
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

    return new Proxy(this, {
      set: (target, key, value) => {
        key = String(key);
        target[key as any] = value;

        let childName: string | undefined = undefined;
        if (value instanceof ControlledObject) {
          childName = value.name;
          value = null;
        }

        const prevData = this.itemsMeta.get(key);
        if (prevData) {
          const base = this.getDispatchBase(key);
          value = safeStringify(value);
          this.itemsMeta.set(key, {
            ...prevData,
            value,
            childName,
          });
          this.dispatch(
            callstackSlice.actions.addOne({
              ...base,
              name: "setVal",
              args: { value, childName },
            }),
          );
        } else {
          const index = this.nextIndex++;
          const newItem = {
            id: uuid.generate(),
            index,
            value,
          };
          this.itemsMeta.set(key, newItem);
          this.dispatch(
            callstackSlice.actions.addOne({
              id: uuid.generate(),
              name: "addArrayItem",
              argType: this.argType,
              treeName: this.name,
              structureType: "array",
              nodeId: newItem.id,
              timestamp: performance.now(),
              args: { value, childName, index, key },
            }),
          );
        }

        return true;
      },
    });
  }

  protected getNodeMeta(key: any): ArrayItemData | undefined {
    return this.itemsMeta.get(key);
  }
}
