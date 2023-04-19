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

export abstract class NodeBase {
  _val: number | string;

  protected constructor(
    val: number | string,
    readonly meta: NodeMeta,
    protected name: string,
    protected dispatch: AppDispatch
  ) {
    this._val = val;
    this.meta = meta;
  }

  public get val(): number | string {
    return this._val;
  }

  public set val(value: number | string) {
    this._val = value;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setVal",
        args: [value],
      })
    );
  }

  public setColor(color: string | null, animation?: string) {
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "setColor",
        args: [color, animation],
      })
    );
  }

  public setColorMap(map: Record<number | string, string>) {
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

  public blink() {
    this.dispatch(
      callstackSlice.actions.addOne({
        ...this.getDispatchBase(),
        name: "blink",
        args: [],
      })
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
