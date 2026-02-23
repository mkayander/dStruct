import { PriorityQueue } from "@datastructures-js/priority-queue";
import uuid from "short-uuid";

import { getRuntimeArrayClass } from "#/entities/dataStructures/array/model/arrayStructure";
import { getRuntimeSet } from "#/entities/dataStructures/array/model/setStructure";
import { getRuntimeString } from "#/entities/dataStructures/array/model/stringStructure";
import {
  getRuntimeBigInt64ArrayClass,
  getRuntimeBigUint64ArrayClass,
  getRuntimeFloat32ArrayClass,
  getRuntimeFloat64ArrayClass,
  getRuntimeInt16ArrayClass,
  getRuntimeInt32ArrayClass,
  getRuntimeUint8ArrayClass,
  getRuntimeUint8ClampedArrayClass,
  getRuntimeUint16ArrayClass,
  getRuntimeUint32ArrayClass,
} from "#/entities/dataStructures/array/model/typedArrayStructure";
import { getRuntimeBinaryTreeClass } from "#/entities/dataStructures/binaryTree/model/binaryTreeNode";
import {
  getRuntimeLinkedListClass,
  getRuntimeQueueClass,
} from "#/entities/dataStructures/linkedList/model/linkedListNode";
import { getRuntimeMap } from "#/entities/dataStructures/map/model/mapStructure";
import { getRuntimeObject } from "#/entities/dataStructures/map/model/objectStructure";
import type { CallstackHelper } from "#/features/callstack/model/callstackSlice";
import {
  safeStringify,
  stripQuotes,
} from "#/shared/lib/stringifySolutionResult";

export const setGlobalRuntimeContext = (callstack: CallstackHelper) => {
  const BinaryTree = getRuntimeBinaryTreeClass(callstack);

  const LinkedList = getRuntimeLinkedListClass(callstack);
  const Queue = getRuntimeQueueClass(LinkedList);

  const ArrayProxy = getRuntimeArrayClass(callstack);

  const Uint32ArrayProxy = getRuntimeUint32ArrayClass(callstack);
  const Int32ArrayProxy = getRuntimeInt32ArrayClass(callstack);
  const Uint16ArrayProxy = getRuntimeUint16ArrayClass(callstack);
  const Int16ArrayProxy = getRuntimeInt16ArrayClass(callstack);
  const Uint8ArrayProxy = getRuntimeUint8ArrayClass(callstack);
  const Uint8ClampedArrayProxy = getRuntimeUint8ClampedArrayClass(callstack);
  const Float32ArrayProxy = getRuntimeFloat32ArrayClass(callstack);
  const Float64ArrayProxy = getRuntimeFloat64ArrayClass(callstack);
  const BigInt64ArrayProxy = getRuntimeBigInt64ArrayClass(callstack);
  const BigUint64ArrayProxy = getRuntimeBigUint64ArrayClass(callstack);

  const StringProxy = getRuntimeString(callstack);

  const SetProxy = getRuntimeSet(callstack);

  const MapProxy = getRuntimeMap(callstack);

  const ObjectProxy = getRuntimeObject(callstack);

  const context = {
    ArrayProxy,
    Uint32ArrayProxy,
    Int32ArrayProxy,
    Uint16ArrayProxy,
    Int16ArrayProxy,
    Uint8ArrayProxy,
    Uint8ClampedArrayProxy,
    Float32ArrayProxy,
    Float64ArrayProxy,
    BigInt64ArrayProxy,
    BigUint64ArrayProxy,
    StringProxy,
    SetProxy,
    MapProxy,
    ObjectProxy,
    Queue,
    PriorityQueue,
    BinaryTree,
    LinkedList,
    ListNode: LinkedList,
    log: (...args: unknown[]) => {
      callstack.addOne({
        id: uuid.generate(),
        timestamp: performance.now(),
        name: "consoleLog",
        args: args.map((arg) => {
          if (typeof arg === "object") {
            return stripQuotes(safeStringify(arg));
          }
          return String(arg);
        }),
      });

      console.log(...args);
    },
  };

  Object.assign(self, context);
};

export const globalDefinitionsPrefix = `
  const console = {...self.console, log: self.log, error: self.error, warn: self.warn, info: self.info};
  const Array = self.ArrayProxy;
  const Uint32Array = self.Uint32ArrayProxy;
  const Int32Array = self.Int32ArrayProxy;
  const Uint16Array = self.Uint16ArrayProxy;
  const Int16Array = self.Int16ArrayProxy;
  const Uint8Array = self.Uint8ArrayProxy;
  const Uint8ClampedArray = self.Uint8ClampedArrayProxy;
  const Float32Array = self.Float32ArrayProxy;
  const Float64Array = self.Float64ArrayProxy;
  const BigInt64Array = self.BigInt64ArrayProxy;
  const BigUint64Array = self.BigUint64ArrayProxy;
  const String = self.StringProxy;
  const Set = self.SetProxy;
  const Map = self.MapProxy;
  const Object = self.ObjectProxy;
`.trim();
export const codePrefixLinesCount = globalDefinitionsPrefix.split("\n").length;
