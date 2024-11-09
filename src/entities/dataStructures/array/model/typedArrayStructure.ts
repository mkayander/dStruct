import type { EntityState } from "@reduxjs/toolkit";

import { makeArrayBaseClass } from "#/entities/dataStructures/array/model/arrayBase";
import { type ArrayItemData } from "#/entities/dataStructures/array/model/arraySlice";
import {
  type ControlledArrayRuntimeOptions,
  initControlledArray,
} from "#/entities/dataStructures/array/model/arrayStructure";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";
import { uuid } from "#/shared/lib";
import { type Constructor } from "#/types/helpers";

import { generateArrayData } from "../lib/generateArrayData";

const generateTypedArrayData = (size: number) =>
  generateArrayData(new Array(size).fill(0));

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
export const getRuntimeUint32ArrayClass = (callstack: CallstackHelper) =>
  class Uint32ArrayProxy extends ControlledUint32Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  };

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
export const getRuntimeInt32ArrayClass = (callstack: CallstackHelper) =>
  class Int32ArrayProxy extends ControlledInt32Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  };

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
export const getRuntimeUint16ArrayClass = (callstack: CallstackHelper) =>
  class Uint16ArrayProxy extends ControlledUint16Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  };

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
export const getRuntimeInt16ArrayClass = (callstack: CallstackHelper) =>
  class Int16ArrayProxy extends ControlledInt16Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  };

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
export const getRuntimeUint8ArrayClass = (callstack: CallstackHelper) =>
  class Uint8ArrayProxy extends ControlledUint8Array {
    constructor(size: number) {
      const data = generateArrayData(new Array(size).fill(0));
      super(size, uuid.generate(), data, callstack, true);
    }
  };

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
export const getRuntimeInt8ArrayClass = (callstack: CallstackHelper) =>
  class Int8ArrayProxy extends ControlledInt8Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  };

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
export const getRuntimeUint8ClampedArrayClass = (callstack: CallstackHelper) =>
  class Uint8ClampedArrayProxy extends ControlledUint8ClampedArray {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  };

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
export const getRuntimeFloat32ArrayClass = (callstack: CallstackHelper) =>
  class Float32ArrayProxy extends ControlledFloat32Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  };

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
export const getRuntimeFloat64ArrayClass = (callstack: CallstackHelper) =>
  class Float64ArrayProxy extends ControlledFloat64Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  };

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
export const getRuntimeBigInt64ArrayClass = (callstack: CallstackHelper) =>
  class BigInt64ArrayProxy extends ControlledBigInt64Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  };

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
export const getRuntimeBigUint64ArrayClass = (callstack: CallstackHelper) =>
  class BigUint64ArrayProxy extends ControlledBigUint64Array {
    constructor(size: number) {
      super(
        size,
        uuid.generate(),
        generateTypedArrayData(size),
        callstack,
        true,
      );
    }
  };
