import type { EntityState } from "@reduxjs/toolkit";
import shortUUID from "short-uuid";

import {
  type ArrayBaseType,
  makeArrayBaseClass,
} from "#/hooks/dataStructures/arrayBase";
import type { CallstackHelper } from "#/store/reducers/callstackReducer";
import {
  arrayDataItemSelectors,
  type ArrayItemData,
  generateArrayData,
} from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";

const uuid = shortUUID();

const ArrayBase = makeArrayBaseClass(Array);

export type ControlledArrayRuntimeOptions = {
  length?: number;
  colorMap?: Record<string, string>;
};

export function initControlledArray<T extends ArrayBaseType>(
  array: T,
  arrayData: EntityState<ArrayItemData, string>,
  name: string,
  callstack: CallstackHelper,
  addToCallstack?: boolean,
  options?: ControlledArrayRuntimeOptions,
  argType: ArgumentType = ArgumentType.ARRAY,
) {
  Object.defineProperties(array, {
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
    callstack: {
      value: callstack,
      enumerable: false,
    },
  });

  if (addToCallstack) {
    array.callstack.addOne({
      ...array.getDispatchBase(),
      name: "addArray",
      args: { arrayData, options },
    });
  }

  return new Proxy(array, {
    set: (target, prop, value) => {
      const index = Number(prop);
      // @ts-expect-error - TS can't infer a type for target[prop]
      target[prop] = value;
      if (Number.isNaN(index)) {
        return true;
      }

      array.updateItem(value, index);

      return true;
    },
  });
}

export class ControlledArray<T> extends ArrayBase<T> {
  private readonly itemsMeta!: ArrayItemData[];

  constructor(
    array: Array<T>,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions,
  ) {
    super();
    this.push(...array);

    return initControlledArray(
      this,
      arrayData,
      name,
      callstack,
      addToCallstack,
      options,
    );
  }

  static _from(
    callstack: CallstackHelper,
    inputArray: Array<number | string>,
    mapFn?: (
      item: number | string | undefined,
      index: number,
    ) => number | string,
    _?: unknown,
    options?: ControlledArrayRuntimeOptions,
  ) {
    const { id, array, data } = ControlledArray._mapArrayData(
      new Array(inputArray.length),
    );
    const newArray = new ControlledArray(
      array,
      id,
      data,
      callstack,
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
    const id = uuid.generate();

    return {
      id,
      array,
      data,
    };
  }

  override pop() {
    const base = this.getDispatchBase(this.length - 1);
    const value = super.pop();
    this.callstack.addOne({
      ...base,
      name: "deleteNode",
    });
    this.itemsMeta.pop();
    return value;
  }

  override map<U>(
    callback: (value: T, index: number, array: T[]) => U,
    _?: unknown,
    options?: ControlledArrayRuntimeOptions,
  ): ControlledArray<U> {
    const { id, array, data } = ControlledArray._mapArrayData(
      new Array(this.length),
      undefined,
    );
    const newArray = new ControlledArray(
      array as U[],
      id,
      data,
      this.callstack,
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
    return new ControlledArray(array as T[], id, data, this.callstack, true);
  }

  protected getNodeMeta(key: number): ArrayItemData | undefined {
    return this.itemsMeta.at(key);
  }

  protected setNodeMeta(key: any, data: ArrayItemData): void {
    this.itemsMeta[key] = data;
  }

  public setHeaders(rowHeaders: string[], colHeaders: string[]) {
    this.callstack.addOne({
      ...this.getDispatchBase(),
      name: "setHeaders",
      args: { rowHeaders, colHeaders },
    });
  }

  public setHeaderRanges({
    rowStart,
    rowEnd,
    colStart,
    colEnd,
  }: {
    rowStart: number;
    rowEnd: number;
    colStart: number;
    colEnd: number;
  }) {
    const rowHeaders = Array.from({ length: rowEnd - rowStart + 1 }, (_, i) =>
      String(i + rowStart),
    );
    const colHeaders = Array.from({ length: colEnd - colStart + 1 }, (_, i) =>
      String(i + colStart),
    );

    this.setHeaders(rowHeaders, colHeaders);
  }

  public showIndexes(m: number, n: number) {
    this.setHeaderRanges({ rowStart: 0, rowEnd: m, colStart: 0, colEnd: n });
  }
}
