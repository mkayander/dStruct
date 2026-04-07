import { ThemeProvider } from "@mui/material/styles";
import { configureStore } from "@reduxjs/toolkit";
import { act, render, screen } from "@testing-library/react";
import React, { useLayoutEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { CallFrame } from "#/features/callstack/model/callstackSlice";
import {
  callstackSlice,
  type CallstackState,
} from "#/features/callstack/model/callstackSlice";
import { CallstackTable } from "#/features/callstack/ui/CallstackTable";
import { StateThemeProvider } from "#/shared/ui/providers/StateThemeProvider";
import type { RootState } from "#/store/makeStore";
import { rootReducer } from "#/store/rootReducer";
import { theme } from "#/themes";

const mockScrollToIndex = vi.fn();

vi.mock("react-virtuoso", () => ({
  TableVirtuoso: React.forwardRef<
    { scrollToIndex: typeof mockScrollToIndex },
    Record<string, unknown>
  >(function MockTableVirtuoso(_, ref) {
    useLayoutEffect(() => {
      if (ref && typeof ref === "object" && "current" in ref) {
        const mutableRef = ref as {
          current: { scrollToIndex: typeof mockScrollToIndex };
        };
        mutableRef.current = {
          scrollToIndex: mockScrollToIndex,
        };
      }
    }, [ref]);
    return <div data-testid="table-virtuoso" />;
  }),
}));

vi.mock("#/shared/hooks", async (importOriginal) => {
  const { mockUseI18nContext } = await import("#/shared/testUtils");
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import("#/shared/hooks")>();
  return {
    ...actual,
    useI18nContext: mockUseI18nContext,
  };
});

const createMockFrame = (id: string, timestamp: number): CallFrame => ({
  id,
  timestamp,
  name: "setVal",
  treeName: "tree",
  nodeId: "n1",
  structureType: "treeNode",
  argType: ArgumentType.BINARY_TREE,
  args: { value: 1 },
});

const createStoreWithCallstack = (callstack: Partial<CallstackState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      callstack: {
        isReady: false,
        isPlaying: false,
        result: null,
        runtime: null,
        startTimestamp: null,
        error: null,
        frames: { ids: [], entities: {} },
        frameIndex: -1,
        ...callstack,
      },
    } as Partial<RootState>,
  });
};

const renderWithProviders = (callstack: Partial<CallstackState>) => {
  const store = createStoreWithCallstack(callstack);
  return {
    store,
    ...render(
      <ReduxProvider store={store}>
        <StateThemeProvider>
          <ThemeProvider theme={theme}>
            <CallstackTable />
          </ThemeProvider>
        </StateThemeProvider>
      </ReduxProvider>,
    ),
  };
};

describe("CallstackTable", () => {
  describe("scroll active row into view", () => {
    const frames = [
      createMockFrame("f1", 100),
      createMockFrame("f2", 200),
      createMockFrame("f3", 300),
    ];

    beforeEach(() => {
      mockScrollToIndex.mockClear();
    });

    it("calls scrollToIndex when frameIndex changes to valid index", () => {
      const { store } = renderWithProviders({
        isReady: true,
        frames: {
          ids: frames.map((frame) => frame.id),
          entities: Object.fromEntries(
            frames.map((frame) => [frame.id, frame]),
          ),
        },
        frameIndex: 0,
        startTimestamp: 100,
      });

      expect(screen.getByTestId("table-virtuoso")).toBeInTheDocument();

      expect(mockScrollToIndex).toHaveBeenCalledWith({
        index: 0,
        align: "center",
        behavior: "smooth",
      });

      mockScrollToIndex.mockClear();

      act(() => {
        store.dispatch(callstackSlice.actions.setFrameIndex(2));
      });

      expect(mockScrollToIndex).toHaveBeenCalledWith({
        index: 2,
        align: "center",
        behavior: "smooth",
      });
    });

    it("does not call scrollToIndex when frameIndex is negative", () => {
      renderWithProviders({
        isReady: true,
        frames: {
          ids: frames.map((frame) => frame.id),
          entities: Object.fromEntries(
            frames.map((frame) => [frame.id, frame]),
          ),
        },
        frameIndex: -1,
        startTimestamp: 100,
      });

      expect(mockScrollToIndex).not.toHaveBeenCalled();
    });

    it("does not call scrollToIndex when frameIndex is out of bounds", () => {
      renderWithProviders({
        isReady: true,
        frames: {
          ids: frames.map((frame) => frame.id),
          entities: Object.fromEntries(
            frames.map((frame) => [frame.id, frame]),
          ),
        },
        frameIndex: 10,
        startTimestamp: 100,
      });

      expect(mockScrollToIndex).not.toHaveBeenCalled();
    });
  });

  describe("when not ready", () => {
    it("renders placeholder message", () => {
      renderWithProviders({
        isReady: false,
        frames: { ids: [], entities: {} },
        frameIndex: -1,
      });

      expect(
        screen.getByText(
          /Here you will see a table of runtime actions once the code is executed/,
        ),
      ).toBeInTheDocument();
    });
  });
});
