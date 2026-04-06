import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { fallbackProxy } from "#/context/I18nContext";
import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { HomeLandingHeroPreviewRuntime } from "#/features/homePage/ui/landing/HomeLandingHeroPreviewRuntime";
import { StateThemeProvider } from "#/shared/ui/providers/StateThemeProvider";
import type { RootState } from "#/store/makeStore";
import { rootReducer } from "#/store/rootReducer";

const { createLandingHeroPreviewStoreMock } = vi.hoisted(() => ({
  createLandingHeroPreviewStoreMock: vi.fn(),
}));

vi.mock("#/features/treeViewer/ui/TreeViewer", () => ({
  TreeViewer: () => <div>Tree preview</div>,
}));

vi.mock("#/features/callstack/ui/CompactCallstackList", () => ({
  CompactCallstackList: () => <div>Callstack preview</div>,
}));

vi.mock("#/features/homePage/model/landingHeroPreviewStore", () => ({
  createLandingHeroPreviewStore: createLandingHeroPreviewStoreMock,
}));

describe("HomeLandingHeroPreviewRuntime", () => {
  it("renders a visible error when the landing preview store fails to initialize", () => {
    createLandingHeroPreviewStoreMock.mockImplementationOnce(() => {
      throw new Error("Landing preview snapshot is missing callstack frames.");
    });

    render(
      <StateThemeProvider>
        <HomeLandingHeroPreviewRuntime LL={fallbackProxy} />
      </StateThemeProvider>,
    );

    expect(
      screen.getByText("HOME_LANDING_PREVIEW_LOAD_FAILED"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Landing preview snapshot is missing callstack frames."),
    ).toBeInTheDocument();
  });

  it("replay resets and keeps playback running when the auto-replay timer was already queued", () => {
    vi.useFakeTimers();

    const initialState = rootReducer(undefined, { type: "test/init" });
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        ...initialState,
        callstack: {
          ...initialState.callstack,
          isReady: true,
          isPlaying: false,
          frameIndex: 1,
          frames: {
            ids: ["f1", "f2"],
            entities: {
              f1: {
                id: "f1",
                timestamp: 1,
                name: "setVal",
                treeName: "head",
                nodeId: "root",
                structureType: "treeNode",
                argType: ArgumentType.BINARY_TREE,
                args: { value: 1 },
              },
              f2: {
                id: "f2",
                timestamp: 2,
                name: "setVal",
                treeName: "head",
                nodeId: "left",
                structureType: "treeNode",
                argType: ArgumentType.BINARY_TREE,
                args: { value: 2 },
              },
            },
          },
        },
      } satisfies RootState,
    });

    createLandingHeroPreviewStoreMock.mockReturnValueOnce(store);

    render(
      <StateThemeProvider>
        <HomeLandingHeroPreviewRuntime LL={fallbackProxy} />
      </StateThemeProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "REPLAY" }));

    expect(store.getState().callstack.frameIndex).toBe(-1);
    expect(store.getState().callstack.isPlaying).toBe(true);

    vi.advanceTimersByTime(1200);

    expect(store.getState().callstack.frameIndex).toBe(-1);
    expect(store.getState().callstack.isPlaying).toBe(true);

    vi.useRealTimers();
  });
});
