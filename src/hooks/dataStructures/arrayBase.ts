import shortUUID from "short-uuid";

import type {
  AddArrayItemFrame,
  CallFrameBase,
  CallstackHelper,
} from "#/store/reducers/callstackReducer";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";
import type { Constructor } from "#/types/helpers";
import type { ArgumentArrayType } from "#/utils/argumentObject";
import { safeStringify } from "#/utils/stringifySolutionResult";

const uuid = shortUUID();

export function makeArrayBaseClass<TBase extends Constructor>(Base: TBase) {
  abstract class BaseStructure extends Base {
    protected readonly name!: string;
    protected readonly argType!: ArgumentArrayType;
    protected readonly callstack!: CallstackHelper;

    protected constructor(...args: any[]) {
      super(...args);
    }

    public blink(index: number) {
      const base = this.getDispatchBase(index);
      if (!base) return;
      this.callstack.addOne({
        ...base,
        name: "blink",
      });
    }

    public setColor(index: number, color: string | null, animation?: string) {
      const base = this.getDispatchBase(index);
      if (!base) return;
      this.callstack.addOne({
        ...base,
        name: "setColor",
        args: { color, animation },
      });
    }

    public showPointer(index: number, name: string) {
      const base = this.getDispatchBase(index);
      if (!base) return;
      this.callstack.addOne({
        ...base,
        name: "showPointer",
        args: { name },
      });
    }

    public setColorMap(colorMap: Record<string, string>) {
      const base = this.getDispatchBase();
      if (!base) return;
      this.callstack.addOne({
        ...base,
        name: "setColorMap",
        args: { colorMap },
      });
    }

    protected abstract getNodeMeta(key: any): ArrayItemData | undefined;

    protected abstract setNodeMeta(key: any, data: ArrayItemData): void;

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

    protected updateItem(value: any, index: number, propKey?: any) {
      let childName: string | undefined = undefined;
      if (value?.argType && value.name) {
        childName = value.name;
        value = null;
      } else {
        value = safeStringify(value);
      }

      const key = propKey ?? index;
      const prevData = this.getNodeMeta(key);
      if (prevData) {
        const base = this.getDispatchBase(key);
        this.setNodeMeta(key, {
          ...prevData,
          value,
          childName,
        });
        this.callstack.addOne({
          ...base,
          name: "setVal",
          args: { value, childName },
        });
      } else {
        const newItem = {
          id: uuid.generate(),
          index,
          value,
          childName,
        };
        this.setNodeMeta(key, newItem);
        const args: AddArrayItemFrame["args"] = { value, childName, index };
        if (typeof propKey === "string") {
          args.key = propKey;
        }
        this.callstack.addOne({
          id: uuid.generate(),
          name: "addArrayItem",
          argType: this.argType,
          treeName: this.name,
          structureType: "array",
          nodeId: newItem.id,
          timestamp: performance.now(),
          args,
        });
      }
    }
  }

  return BaseStructure;
}
