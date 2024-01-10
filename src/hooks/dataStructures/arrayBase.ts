import shortUUID from "short-uuid";

import type { AppDispatch } from "#/store/makeStore";
import {
  type CallFrameBase,
  callstackSlice,
} from "#/store/reducers/callstackReducer";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";
import type { Constructor } from "#/types/helpers";
import type { ArgumentArrayType } from "#/utils/argumentObject";

const uuid = shortUUID();

export function makeArrayBaseClass<TBase extends Constructor>(Base: TBase) {
  abstract class BaseStructure extends Base {
    protected readonly name!: string;
    protected readonly argType!: ArgumentArrayType;

    protected readonly dispatch!: AppDispatch;

    protected constructor(...args: any[]) {
      super(...args);
    }

    public blink(index: number) {
      const base = this.getDispatchBase(index);
      if (!base) return;
      this.dispatch(
        callstackSlice.actions.addOne({
          ...base,
          name: "blink",
        }),
      );
    }

    public setColor(index: number, color: string | null, animation?: string) {
      const base = this.getDispatchBase(index);
      if (!base) return;
      this.dispatch(
        callstackSlice.actions.addOne({
          ...base,
          name: "setColor",
          args: { color, animation },
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
          args: { name },
        }),
      );
    }

    public setColorMap(colorMap: Record<string, string>) {
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

    protected abstract getNodeMeta(key: any): ArrayItemData | undefined;

    protected getDispatchBase(key?: any) {
      const data = {
        id: uuid.generate(),
        argType: this.argType,
        nodeId: "-1",
        treeName: this.name,
        structureType: "array",
        timestamp: performance.now(),
      } satisfies CallFrameBase & { nodeId: string };
      if (key !== undefined) {
        const meta = this.getNodeMeta(key);
        meta && (data.nodeId = meta.id);
      }
      return data;
    }
  }

  return BaseStructure;
}
