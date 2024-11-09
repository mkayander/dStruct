import type { EntityState } from "@reduxjs/toolkit";

import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";
import { makeArrayBaseClass } from "#/hooks/dataStructures/arrayBase";
import {
  type ControlledArrayRuntimeOptions,
  initControlledArray,
} from "#/hooks/dataStructures/arrayStructure";
import { type ArrayItemData } from "#/store/reducers/structures/arrayReducer";
import { type Constructor } from "#/types/helpers";

const makeTypedArrayClass = <T extends Constructor>(Base: T) => {
  return class extends makeArrayBaseClass(Base) {
    private readonly itemsMeta!: ArrayItemData[];

    protected getNodeMeta(key: number): ArrayItemData | undefined {
      return this.itemsMeta.at(key);
    }

    protected setNodeMeta(key: any, data: ArrayItemData): void {
      this.itemsMeta[key] = data;
    }
  };
};

export class ControlledUint32Array extends makeTypedArrayClass(Uint32Array) {
  constructor(
    size: number,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions,
  ) {
    super(size);

    return initControlledArray(
      this,
      arrayData,
      name,
      callstack,
      addToCallstack,
      options,
    );
  }
}

export class ControlledInt32Array extends makeTypedArrayClass(Int32Array) {
  constructor(
    size: number,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions,
  ) {
    super(size);

    return initControlledArray(
      this,
      arrayData,
      name,
      callstack,
      addToCallstack,
      options,
    );
  }
}

export class ControlledUint16Array extends makeTypedArrayClass(Uint16Array) {
  constructor(
    size: number,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions,
  ) {
    super(size);

    return initControlledArray(
      this,
      arrayData,
      name,
      callstack,
      addToCallstack,
      options,
    );
  }
}

export class ControlledInt16Array extends makeTypedArrayClass(Int16Array) {
  constructor(
    size: number,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions,
  ) {
    super(size);

    return initControlledArray(
      this,
      arrayData,
      name,
      callstack,
      addToCallstack,
      options,
    );
  }
}

export class ControlledUint8Array extends makeTypedArrayClass(Uint8Array) {
  constructor(
    size: number,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions,
  ) {
    super(size);

    return initControlledArray(
      this,
      arrayData,
      name,
      callstack,
      addToCallstack,
      options,
    );
  }
}

export class ControlledInt8Array extends makeTypedArrayClass(Int8Array) {
  constructor(
    size: number,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions,
  ) {
    super(size);

    return initControlledArray(
      this,
      arrayData,
      name,
      callstack,
      addToCallstack,
      options,
    );
  }
}

export class ControlledUint8ClampedArray extends makeTypedArrayClass(
  Uint8ClampedArray,
) {
  constructor(
    size: number,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions,
  ) {
    super(size);

    return initControlledArray(
      this,
      arrayData,
      name,
      callstack,
      addToCallstack,
      options,
    );
  }
}

export class ControlledFloat32Array extends makeTypedArrayClass(Float32Array) {
  constructor(
    size: number,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions,
  ) {
    super(size);

    return initControlledArray(
      this,
      arrayData,
      name,
      callstack,
      addToCallstack,
      options,
    );
  }
}

export class ControlledFloat64Array extends makeTypedArrayClass(Float64Array) {
  constructor(
    size: number,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions,
  ) {
    super(size);

    return initControlledArray(
      this,
      arrayData,
      name,
      callstack,
      addToCallstack,
      options,
    );
  }
}

export class ControlledBigInt64Array extends makeTypedArrayClass(
  BigInt64Array,
) {
  constructor(
    size: number,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions,
  ) {
    super(size);

    return initControlledArray(
      this,
      arrayData,
      name,
      callstack,
      addToCallstack,
      options,
    );
  }
}

export class ControlledBigUint64Array extends makeTypedArrayClass(
  BigUint64Array,
) {
  constructor(
    size: number,
    name: string,
    arrayData: EntityState<ArrayItemData, string>,
    callstack: CallstackHelper,
    addToCallstack?: boolean,
    options?: ControlledArrayRuntimeOptions,
  ) {
    super(size);

    return initControlledArray(
      this,
      arrayData,
      name,
      callstack,
      addToCallstack,
      options,
    );
  }
}
