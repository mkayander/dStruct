import shortUUID from "short-uuid";

import { type CallstackHelper } from "#/store/reducers/callstackReducer";
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
  protected readonly callstack!: CallstackHelper;

  protected constructor(
    val: T,
    meta: NodeMeta,
    name: string,
    callstack: CallstackHelper,
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
      callstack: {
        value: callstack,
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
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "setVal",
      args: { value },
    });
  }

  public setColor(color: string | null, animation?: string) {
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "setColor",
      args: { color, animation },
    });
  }

  public setColorMap(colorMap: Record<T, string>) {
    const base = this.getDispatchBase();
    if (!base) return;
    this.callstack.addOne({
      ...base,
      name: "setColorMap",
      args: { colorMap },
    });
  }

  public blink() {
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "blink",
    });
  }

  public setInfo(info: Record<string, any>) {
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "setInfo",
      args: { info },
    });
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
