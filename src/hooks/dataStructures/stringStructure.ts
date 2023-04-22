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

export class ControlledString extends String {
  private readonly itemsMeta: ArrayItemData[];

  constructor(
    value: unknown,
    private name: string,
    arrayData: EntityState<ArrayItemData>,
    private dispatch: AppDispatch,
    addToCallstack?: boolean
  ) {
    super(value);

    if (addToCallstack) {
      this.dispatch(
        callstackSlice.actions.addOne({
          ...this.getDispatchBase(),
          name: "addArray",
          args: [arrayData],
        })
      );
    }

    this.itemsMeta = arrayDataItemSelectors.selectAll(arrayData);
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
        args: [],
      })
    );
  }

  public setColorMap(map: Record<string, string>) {
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
      argType: ArgumentType.ARRAY,
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
