import shortUUID from "short-uuid";

import { type CallstackHelper } from "#/store/reducers/callstackReducer";
import { type ArgumentTreeType } from "#/utils/argumentObject";

const uuid = shortUUID();

export interface NodeMeta {
  id: string;
  type: ArgumentTreeType;
  displayTraversal?: boolean;
  color?: string | null;
  animation?: string | null;
  colorMap?: Record<number | string, string>;
  info?: Record<string, any>;
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
    const prevVal = this._val;
    this._val = value;
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "setVal",
      args: { value },
      prevArgs: { value: prevVal },
    });
  }

  public setColor(color: string | null, animation?: string) {
    const prevColor = this.meta.color;
    const prevAnimation = this.meta.animation;
    this.meta.color = color;
    this.meta.animation = animation;
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "setColor",
      args: { color, animation },
      prevArgs: { color: prevColor, animation: prevAnimation },
    });
  }

  public setColorMap(colorMap: Record<T, string>) {
    const prevColorMap = this.meta.colorMap;
    this.meta.colorMap = colorMap;
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "setColorMap",
      args: { colorMap },
      prevArgs: { colorMap: prevColorMap },
    });
  }

  public blink() {
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "blink",
    });
  }

  public setInfo(info: Record<string, any>) {
    const prevInfo = this.meta.info;
    this.meta.info = info;
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "setInfo",
      args: { info },
      prevArgs: { info: prevInfo },
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
