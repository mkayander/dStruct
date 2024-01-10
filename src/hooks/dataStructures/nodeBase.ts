import shortUUID from "short-uuid";

import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import { type ArgumentTreeType } from "#/utils/argumentObject";

const uuid = shortUUID();

export interface NodeMeta {
  id: string;
  type: ArgumentTreeType;
  displayTraversal?: boolean;
}

export abstract class NodeBase<T extends number | string> {
  readonly meta!: NodeMeta;
  protected name!: string;
  protected readonly dispatch!: AppDispatch;

  protected constructor(
    val: T,
    meta: NodeMeta,
    name: string,
    dispatch: AppDispatch,
  ) {
    Object.defineProperties(this, {
      _val: {
        value: val,
        enumerable: false,
        writable: true,
      },
      meta: {
        value: meta,
        enumerable: false,
      },
      name: {
        value: name,
        enumerable: false,
        writable: true,
      },
      dispatch: {
        value: dispatch,
        enumerable: false,
      },
    });
  }

  _val!: T;

  public get val(): T {
    return this._val;
  }

  public set val(value: T) {
    this._val = value;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setVal",
        args: { value },
      }),
    );
  }

  public setColor(color: string | null, animation?: string) {
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setColor",
        args: { color, animation },
      }),
    );
  }

  public setColorMap(colorMap: Record<T, string>) {
    const base = this.getDispatchBase();
    if (!base) return;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...base,
        name: "setColorMap",
        args: { colorMap },
      }),
    );
  }

  public blink() {
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "blink",
      }),
    );
  }

  public setInfo(info: Record<string, any>) {
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setInfo",
        args: { info },
      }),
    );
  }

  protected getDispatchBase() {
    return {
      id: uuid.generate(),
      argType: this.meta.type,
      treeName: this.name,
      structureType: "treeNode",
      nodeId: this.meta.id,
      timestamp: performance.now(),
    } as const;
  }
}
