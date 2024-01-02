import type { EntityState } from "@reduxjs/toolkit";

import { makeBaseStructureClass } from "#/hooks/dataStructures/baseStructure";
import type { AppDispatch } from "#/store/makeStore";
import { callstackSlice } from "#/store/reducers/callstackReducer";
import {
  arrayDataItemSelectors,
  type ArrayItemData,
} from "#/store/reducers/structures/arrayReducer";
import { ArgumentType } from "#/utils/argumentObject";

const BaseStructure = makeBaseStructureClass(String);

export class ControlledString extends BaseStructure {
  constructor(
    value: unknown,
    name: string,
    arrayData: EntityState<ArrayItemData>,
    dispatch: AppDispatch,
    addToCallstack?: boolean,
  ) {
    super(value);
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
        value: ArgumentType.STRING,
        enumerable: false,
      },
      dispatch: {
        value: dispatch,
        enumerable: false,
      },
    });

    if (addToCallstack) {
      this.dispatch(
        callstackSlice.actions.addOne({
          ...this.getDispatchBase(),
          name: "addArray",
          args: [arrayData, undefined],
        }),
      );
    }
  }
}
