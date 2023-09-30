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
  private readonly name!: string;
  private readonly itemsMeta!: ArrayItemData[];
  private readonly dispatch!: AppDispatch;

  constructor(
    value: unknown,
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
        value: arrayDataItemSelectors.selectAll(arrayData),
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
          args: [arrayData, undefined],
        }),
      );
    }
  }

  public setColor(index: number, color: string | null, animation?: string) {
    const base = this.getDispatchBase(index);
    if (!base) return;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...base,
        name: "setColor",
        args: [color, animation],
      }),
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
      }),
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
      }),
    );
  }

  protected getDispatchBase(index?: number) {
    const data = {
      id: uuid.generate(),
      argType: ArgumentType.STRING,
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
