import type { EntityState } from "@reduxjs/toolkit";
import shortUUID from "short-uuid";

import type { AppDispatch } from "#/store/makeStore";
import {
  type CallFrameBase,
  callstackSlice,
} from "#/store/reducers/callstackReducer";
import {
  arrayDataItemSelectors,
  type ArrayItemData,
} from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";

const uuid = shortUUID();

export type ControlledArrayRuntimeOptions = {
  parentName?: string;
  index?: number;
  length?: number;
  matrixName?: string;
};

export class ControlledArray<T extends number | string> extends Array<T> {
  private readonly itemsMeta: ArrayItemData[];
  private readonly _argType: ArgumentType.ARRAY | ArgumentType.MATRIX;

  constructor(
    array: Array<T>,
    private readonly name: string,
    arrayData: EntityState<ArrayItemData>,
    private dispatch: AppDispatch,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions
  ) {
    super();

    let actionArrayData: EntityState<ArrayItemData> | undefined = undefined;
    this._argType = ArgumentType.ARRAY;

    if (options?.matrixName) {
      this.name = options.matrixName;
      this._argType = ArgumentType.MATRIX;
      options.length = array.length;
    } else {
      actionArrayData = arrayData;
    }

    this.push(...array);

    if (addToCallstack) {
      this.dispatch(
        callstackSlice.actions.addOne({
          ...this.getDispatchBase(),
          name: "addArray",
          args: [actionArrayData, options],
        })
      );
    }

    this.itemsMeta = arrayDataItemSelectors.selectAll(arrayData);

    return new Proxy(this, {
      set: (target, prop, value) => {
        const index = Number(prop);
        target[prop as any] = value;
        if (Number.isNaN(index)) {
          return true;
        }

        const prevData = this.itemsMeta[index];
        if (!prevData) {
          const newItem = {
            id: uuid.generate(),
            index,
            value,
            children: [],
          };
          dispatch(
            callstackSlice.actions.addOne({
              id: uuid.generate(),
              argType: ArgumentType.ARRAY,
              treeName: this.name,
              structureType: "array",
              nodeId: newItem.id,
              timestamp: performance.now(),
              name: "addArrayItem",
              args: [value, index],
            })
          );
          this.itemsMeta[index] = newItem;
          return true;
        }

        const base = this.getDispatchBase(index);
        if (!base) return true;

        this.itemsMeta[index] = { ...prevData, value };

        dispatch(
          callstackSlice.actions.addOne({
            ...base,
            name: "setVal",
            args: [value],
          })
        );
        return true;
      },
    });
  }

  override pop() {
    const base = this.getDispatchBase(this.length - 1);
    const value = super.pop();
    this.dispatch(
      callstackSlice.actions.addOne({
        ...base,
        name: "deleteNode",
        args: [],
      })
    );
    this.itemsMeta.pop();
    return value;
  }

  public blink(index: number) {
    const base = this.getDispatchBase(index);
    if (!base) return;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...base,
        name: "blink",
        args: [],
      })
    );
  }

  public setColor(index: number, color: string | null, animation?: string) {
    const base = this.getDispatchBase(index);
    if (!base) return;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...base,
        name: "setColor",
        args: [color, animation],
      })
    );
  }

  public showPointer(index: number, name: string) {
    const base = this.getDispatchBase(index);
    if (!base) return;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...base,
        name: "showPointer",
        args: [name],
      })
    );
  }

  public setColorMap(map: Record<T, string>) {
    const base = this.getDispatchBase();
    if (!base) return;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...base,
        name: "setColorMap",
        args: [map],
      })
    );
  }

  protected getDispatchBase(index?: number) {
    const data = {
      id: uuid.generate(),
      argType: this._argType,
      nodeId: "-1",
      treeName: this.name,
      structureType: "array",
      timestamp: performance.now(),
    } satisfies CallFrameBase & { nodeId: string };
    if (index !== undefined) {
      const meta = this.getNodeMeta(index);
      meta && (data.nodeId = meta.id);
    }
    return data;
  }

  private getNodeMeta(index: number) {
    return this.itemsMeta.at(index);
  }
}
