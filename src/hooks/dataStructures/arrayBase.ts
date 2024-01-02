import shortUUID from "short-uuid";

import type { AppDispatch } from "#/store/makeStore";
import {
  type CallFrameBase,
  callstackSlice,
} from "#/store/reducers/callstackReducer";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";
import type { Constructor } from "#/types/helpers";
import type { ArgumentType } from "#/utils/argumentObject";

const uuid = shortUUID();

export function makeArrayBaseClass<TBase extends Constructor>(Base: TBase) {
  class BaseStructure extends Base {
    protected readonly name!: string;
    protected readonly itemsMeta!: ArrayItemData[];
    protected readonly argType!:
      | ArgumentType.ARRAY
      | ArgumentType.MATRIX
      | ArgumentType.STRING;
    protected readonly dispatch!: AppDispatch;

    public blink(index: number) {
      const base = this.getDispatchBase(index);
      if (!base) return;
      this.dispatch(
        callstackSlice.actions.addOne({
          ...base,
          name: "blink",
          args: [],
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
        argType: this.argType,
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

  return BaseStructure;
}
