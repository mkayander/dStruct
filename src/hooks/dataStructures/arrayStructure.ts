import type { EntityState } from "@reduxjs/toolkit";
import shortUUID from "short-uuid";

import { getChildArrayName } from "#/hooks/useArgumentsParsing";
import type { AppDispatch } from "#/store/makeStore";
import {
  type CallFrameBase,
  callstackSlice,
} from "#/store/reducers/callstackReducer";
import {
  arrayDataItemSelectors,
  type ArrayItemData,
  generateArrayData,
} from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";

const uuid = shortUUID();

export type ControlledArrayRuntimeOptions = {
  parentName?: string;
  index?: number;
  length?: number;
  matrixName?: string;
  colorMap?: Record<string, string>;
};

export class ControlledArray<T> extends Array<T> {
  private readonly name!: string;
  private readonly itemsMeta!: ArrayItemData[];
  private readonly _argType!: ArgumentType.ARRAY | ArgumentType.MATRIX;
  private readonly dispatch!: AppDispatch;

  constructor(
    array: Array<T>,
    name: string,
    arrayData: EntityState<ArrayItemData>,
    dispatch: AppDispatch,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions
  ) {
    super();

    let actionArrayData: EntityState<ArrayItemData> | undefined = undefined;
    let _argType: ArgumentType.ARRAY | ArgumentType.MATRIX = ArgumentType.ARRAY;

    if (options?.matrixName) {
      name = options.matrixName;
      _argType = ArgumentType.MATRIX;
      options.length = array.length;
    } else {
      actionArrayData = arrayData;
    }

    Object.defineProperties(this, {
      name: {
        value: name,
        enumerable: false,
      },
      itemsMeta: {
        value: arrayDataItemSelectors.selectAll(arrayData),
        enumerable: false,
      },
      _argType: {
        value: _argType,
        enumerable: false,
      },
      dispatch: {
        value: dispatch,
        enumerable: false,
      },
    });

    this.push(...array);

    if (addToCallstack) {
      this.dispatch(
        callstackSlice.actions.addOne({
          ...this.getDispatchBase(),
          name: "addArray",
          args: [actionArrayData, options],
        })
      );
    }

    return new Proxy(this, {
      set: (target, prop, value) => {
        const index = Number(prop);
        target[prop as any] = value;
        if (Number.isNaN(index)) {
          return true;
        }

        const prevData = this.itemsMeta[index];
        if (!prevData) {
          const newItem = {
            id: uuid.generate(),
            index,
            value,
            children: [],
          };
          dispatch(
            callstackSlice.actions.addOne({
              id: uuid.generate(),
              argType: ArgumentType.ARRAY,
              treeName: this.name,
              structureType: "array",
              nodeId: newItem.id,
              timestamp: performance.now(),
              name: "addArrayItem",
              args: [value, index],
            })
          );
          this.itemsMeta[index] = newItem;
          return true;
        }

        const base = this.getDispatchBase(index);
        if (!base) return true;

        this.itemsMeta[index] = { ...prevData, value };

        dispatch(
          callstackSlice.actions.addOne({
            ...base,
            name: "setVal",
            args: [value],
          })
        );
        return true;
      },
    });
  }

  static _from(
    dispatch: AppDispatch,
    inputArray: Array<number | string>,
    mapFn?: (
      item: number | string | undefined,
      index: number
    ) => number | string,
    thisArg?: unknown,
    options?: ControlledArrayRuntimeOptions
  ) {
    const { id, array, data } = this._mapArrayData(
      inputArray,
      mapFn,
      thisArg,
      options
    );
    return new ControlledArray(array, id, data, dispatch, true, options);
  }

  static _mapArrayData<T, U>(
    inputArray: T[],
    mapFn?: (item: T, index: number, array: T[]) => U,
    thisArg?: unknown,
    options?: ControlledArrayRuntimeOptions
  ) {
    const array = [];
    if (mapFn) {
      for (let i = 0; i < inputArray.length; i++) {
        array[i] = mapFn(inputArray[i] as T, i, inputArray);
      }
    } else {
      array.push(...inputArray);
    }
    const data = generateArrayData(array);
    let id: string;
    if (options?.parentName && options.index !== undefined) {
      id = getChildArrayName(options.parentName, options.index);
    } else {
      id = uuid.generate();
    }

    return {
      id,
      array,
      data,
    };
  }

  override pop() {
    const base = this.getDispatchBase(this.length - 1);
    const value = super.pop();
    this.dispatch(
      callstackSlice.actions.addOne({
        ...base,
        name: "deleteNode",
        args: [],
      })
    );
    this.itemsMeta.pop();
    return value;
  }

  override map<U>(
    callback: (value: T, index: number, array: T[]) => U,
    thisArg?: unknown,
    options?: ControlledArrayRuntimeOptions
  ): ControlledArray<U> {
    const { id, array, data } = ControlledArray._mapArrayData(
      this,
      callback,
      thisArg,
      options
    );
    return new ControlledArray(
      array as U[],
      id,
      data,
      this.dispatch,
      true,
      options
    );
  }

  public blink(index: number) {
    const base = this.getDispatchBase(index);
    if (!base) return;
    this.dispatch(
      callstackSlice.actions.addOne({
        ...base,
        name: "blink",
        args: [],
      })
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
      })
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
      })
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
      })
    );
  }

  protected getDispatchBase(index?: number) {
    const data = {
      id: uuid.generate(),
      argType: this._argType,
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
