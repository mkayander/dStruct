import { configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import {
  caseSlice,
  selectCaseArguments,
} from "#/entities/argument/model/caseSlice";
import { callstackSlice } from "#/features/callstack/model/callstackSlice";
import { rootReducer } from "#/store/rootReducer";

describe("caseSlice selectors", () => {
  it("selectCaseArguments returns the same array reference when args entity state is unchanged", () => {
    const store = configureStore({ reducer: rootReducer });

    store.dispatch(
      caseSlice.actions.setArguments({
        projectId: "project-1",
        caseId: "case-1",
        data: [
          {
            name: "head",
            order: 0,
            type: ArgumentType.BINARY_TREE,
            input: "[1,null,2]",
          },
        ],
      }),
    );

    const stateAfterCase = store.getState();
    const argsFirstRead = selectCaseArguments(stateAfterCase);
    const argsSecondRead = selectCaseArguments(stateAfterCase);

    expect(argsSecondRead).toBe(argsFirstRead);

    store.dispatch(callstackSlice.actions.removeAll());

    const stateAfterOtherSlice = store.getState();
    const argsAfterUnrelatedDispatch =
      selectCaseArguments(stateAfterOtherSlice);

    expect(argsAfterUnrelatedDispatch).toBe(argsFirstRead);
  });

  it("selectCaseArguments returns a new array reference after setArguments replaces entities", () => {
    const store = configureStore({ reducer: rootReducer });

    const headArgument = {
      name: "head",
      order: 0,
      type: ArgumentType.BINARY_TREE,
      input: "[1]",
    };

    store.dispatch(
      caseSlice.actions.setArguments({
        projectId: "project-1",
        caseId: "case-1",
        data: [headArgument],
      }),
    );

    const firstArgs = selectCaseArguments(store.getState());

    store.dispatch(
      caseSlice.actions.setArguments({
        projectId: "project-1",
        caseId: "case-1",
        data: [{ ...headArgument }],
      }),
    );

    const secondArgs = selectCaseArguments(store.getState());

    expect(secondArgs).not.toBe(firstArgs);
    expect(secondArgs).toEqual(firstArgs);
  });
});
