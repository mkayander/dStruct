"use client";

import { configureStore } from "@reduxjs/toolkit";
import { act, render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { caseSlice } from "#/entities/argument/model/caseSlice";
import { callstackSlice } from "#/features/callstack/model/callstackSlice";
import { useArgumentsParsing } from "#/features/treeViewer/hooks/useArgumentsParsing";
import { rootReducer } from "#/store/rootReducer";

const ArgumentsParsingHarness: React.FC = () => {
  useArgumentsParsing();
  return null;
};

describe("useArgumentsParsing", () => {
  const headArgument = {
    name: "head",
    order: 0,
    type: ArgumentType.BINARY_TREE,
    input: "[1,null,2]",
  };

  let removeAllSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    removeAllSpy = vi.spyOn(callstackSlice.actions, "removeAll");
  });

  afterEach(() => {
    removeAllSpy.mockRestore();
  });

  it("does not dispatch removeAll when setArguments re-applies the same logical args (new entity state)", async () => {
    const baseState = rootReducer(undefined, { type: "@@INIT" });
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        ...baseState,
        testCase: {
          ...baseState.testCase,
          projectId: "project-1",
          caseId: "case-1",
          args: {
            ids: [headArgument.name],
            entities: { [headArgument.name]: headArgument },
          },
          info: { [headArgument.name]: { isParsed: true } },
        },
      },
    });

    render(
      <Provider store={store}>
        <ArgumentsParsingHarness />
      </Provider>,
    );

    await act(async () => {
      await Promise.resolve();
    });

    const removeAllCountAfterMount = removeAllSpy.mock.calls.length;

    await act(async () => {
      store.dispatch(
        caseSlice.actions.setArguments({
          projectId: "project-1",
          caseId: "case-1",
          data: [{ ...headArgument }],
        }),
      );
      await Promise.resolve();
    });

    expect(removeAllSpy.mock.calls.length).toBe(removeAllCountAfterMount);
  });
});
