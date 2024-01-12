import type { EntityState } from "@reduxjs/toolkit";
import shortUUID from "short-uuid";

import { makeArrayBaseClass } from "#/hooks/dataStructures/arrayBase";
import { getChildArrayName } from "#/hooks/useArgumentsParsing";
import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import {
  arrayDataItemSelectors,
  type ArrayItemData,
  generateArrayData,
} from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";

const uuid = shortUUID();

const ArrayBase = makeArrayBaseClass(Array);

export type ControlledArrayRuntimeOptions = {
  parentName?: string;
  index?: number;
  length?: number;
  matrixName?: string;
  colorMap?: Record<string, string>;
};

export class ControlledArray<T> extends ArrayBase<T> {
  private readonly itemsMeta!: ArrayItemData[];

  constructor(
    array: Array<T>,
    name: string,
    arrayData: EntityState<ArrayItemData>,
    dispatch: AppDispatch,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions,
  ) {
    super();

    let actionArrayData: EntityState<ArrayItemData> | undefined = undefined;
    let argType: ArgumentType.ARRAY | ArgumentType.MATRIX = ArgumentType.ARRAY;

    if (options?.matrixName) {
      name = options.matrixName;
      argType = ArgumentType.MATRIX;
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
      argType: {
        value: argType,
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
          args: { arrayData: actionArrayData, options },
        }),
      );
    }

    return new Proxy(this, {
      set: (target, prop, value) => {
        const index = Number(prop);
        target[prop as any] = value;
        if (Number.isNaN(index)) {
          return true;
        }

        this.updateItem(value, index);

        return true;
      },
    });
  }

  static _from(
    dispatch: AppDispatch,
    inputArray: Array<number | string>,
    mapFn?: (
      item: number | string | undefined,
      index: number,
    ) => number | string,
    thisArg?: unknown,
    options?: ControlledArrayRuntimeOptions,
  ) {
    const { id, array, data } = ControlledArray._mapArrayData(
      new Array(inputArray.length),
      undefined,
      thisArg,
      options,
    );
    const newArray = new ControlledArray(
      array,
      id,
      data,
      dispatch,
      true,
      options,
    );

    for (let i = 0; i < inputArray.length; i++) {
      newArray[i] = mapFn ? mapFn(inputArray[i], i) : inputArray[i];
    }

    return newArray;
  }

  static _mapArrayData<T, U>(
    inputArray: T[],
    mapFn?: (item: T, index: number, array: T[]) => U,
    thisArg?: unknown,
    options?: ControlledArrayRuntimeOptions,
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
      }),
    );
    this.itemsMeta.pop();
    return value;
  }

  override map<U>(
    callback: (value: T, index: number, array: T[]) => U,
    thisArg?: unknown,
    options?: ControlledArrayRuntimeOptions,
  ): ControlledArray<U> {
    const { id, array, data } = ControlledArray._mapArrayData(
      new Array(this.length),
      undefined,
      thisArg,
      options,
    );
    const newArray = new ControlledArray(
      array as U[],
      id,
      data,
      this.dispatch,
      true,
      options,
    );
    for (let i = 0; i < this.length; i++) {
      newArray[i] = callback(this[i]!, i, this);
    }
    return newArray;
  }

  override slice(start?: number, end?: number): T[] {
    const slicedArray = Array.from(this).slice(start, end);
    const { id, array, data } = ControlledArray._mapArrayData(slicedArray);
    return new ControlledArray(array as T[], id, data, this.dispatch, true);
  }

  protected getNodeMeta(key: number): ArrayItemData | undefined {
    return this.itemsMeta.at(key);
  }

  protected setNodeMeta(key: any, data: ArrayItemData): void {
    this.itemsMeta[key] = data;
  }
}
