import shortUUID from "short-uuid";

import type {
  AddArrayItemFrame,
  CallFrameBase,
  CallstackHelper,
} from "#/store/reducers/callstackReducer";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";
import { type AnimationName } from "#/store/reducers/structures/baseStructureReducer";
import type { Constructor } from "#/types/helpers";
import type { ArgumentArrayType } from "#/utils/argumentObject";
import { safeStringify } from "#/utils/stringifySolutionResult";

const uuid = shortUUID();

export interface ArrayMeta {
  colorMap?: Record<string, string> | null;
}

export function makeArrayBaseClass<TBase extends Constructor>(Base: TBase) {
  abstract class BaseStructure extends Base {
    readonly callstack!: CallstackHelper;
    protected readonly name!: string;
    protected readonly argType!: ArgumentArrayType;
    protected readonly meta!: ArrayMeta;

    protected constructor(...args: any[]) {
      super(...args);
      Object.defineProperty(this, "meta", {
        enumerable: false,
        value: {},
      });
    }

    public blink(index: number) {
      const base = this.getDispatchBase();
      const prevFrame = this.callstack.frames.at(-1);
      if (prevFrame?.name === "blink" && prevFrame.nodeId === base.nodeId)
        return;

      this.callstack.addOne({
        ...this.getDispatchBase(index),
        name: "blink",
      });
    }

    public setColor(
      index: number,
      color: string | null,
      animation?: AnimationName,
    ) {
      const meta = this.getNodeMeta(index);
      const { color: prevColor, animation: prevAnimation } = meta ?? {};
      if (meta) {
        meta.color = color;
        meta.animation = animation;
      }
      this.callstack.addOne({
        ...this.getDispatchBase(index),
        name: "setColor",
        args: { color, animation },
        prevArgs: { color: prevColor, animation: prevAnimation },
      });
    }

    public showPointer(index: number, name: string) {
      this.callstack.addOne({
        ...this.getDispatchBase(index),
        name: "showPointer",
        args: { name },
      });
    }

    public setColorMap(colorMap: Record<string, string>) {
      const prevColorMap = this.meta.colorMap;
      this.meta.colorMap = colorMap;
      this.callstack.addOne({
        ...this.getDispatchBase(),
        name: "setColorMap",
        args: { colorMap },
        prevArgs: { colorMap: prevColorMap },
      });
    }

    getDispatchBase(key?: any) {
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
        if (meta) {
          data.nodeId = meta.id;
        }
      }
      return data;
    }

    updateItem(value: any, index: number, propKey?: any) {
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
          prevArgs: { value: prevData.value, childName: prevData.childName },
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
        if (propKey !== undefined) {
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

    protected abstract getNodeMeta(key: any): ArrayItemData | undefined;

    protected abstract setNodeMeta(key: any, data: ArrayItemData): void;
  }

  return BaseStructure;
}

const base = makeArrayBaseClass(Object);
export type ArrayBaseType = InstanceType<typeof base>;
