import type { EntityState } from "@reduxjs/toolkit";
import shortUUID from "short-uuid";

import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import {
  arrayDataItemSelectors,
  type ArrayItemData,
} from "#/store/reducers/structures/arrayReducer";

const uuid = shortUUID();

export class ControlledArray extends Array {
  private readonly itemsMeta: ArrayItemData[];

  constructor(
    array: Array<number | string>,
    private name: string,
    arrayData: EntityState<ArrayItemData>,
    private dispatch: AppDispatch
  ) {
    super();
    this.push(...array);

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
          dispatch(
            callstackSlice.actions.addOne({
              id: uuid.generate(),
              treeName: this.name,
              nodeId: uuid.generate(),
              timestamp: performance.now(),
              name: "addNode",
              args: [value],
            })
          );
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

  private getNodeMeta(index: number) {
    return this.itemsMeta[index];
  }

  protected getDispatchBase(index: number) {
    const meta = this.getNodeMeta(index);
    if (!meta) return null;
    return {
      id: uuid.generate(),
      treeName: this.name,
      nodeId: meta.id,
      timestamp: performance.now(),
    };
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

  public showPointer(index: number) {
    const base = this.getDispatchBase(index);
    if (!base) return;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...base,
        name: "showPointer",
      })
    );
  }
}
