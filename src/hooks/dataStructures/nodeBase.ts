import shortUUID from "short-uuid";

import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";

const uuid = shortUUID();

export interface NodeMeta {
  id: string;
  displayTraversal?: boolean;
}

export abstract class NodeBase {
  private _val: number | string;

  protected constructor(
    val: number | string,
    protected meta: NodeMeta,
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
      treeName: this.name,
      nodeId: this.meta.id,
      timestamp: performance.now(),
    };
  }
}
