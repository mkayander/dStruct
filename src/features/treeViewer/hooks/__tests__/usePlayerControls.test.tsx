import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

import { makeStore } from "#/store/makeStore";

import { usePlayerControls } from "../usePlayerControls";

const { resetStructuresStateMock } = vi.hoisted(() => ({
  resetStructuresStateMock: vi.fn(),
}));

vi.mock("#/features/treeViewer/lib", () => ({
  resetStructuresState: resetStructuresStateMock,
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={makeStore()}>{children}</Provider>
);

describe("usePlayerControls", () => {
  it("increments replayCount for repeated replay calls in the same update", () => {
    const { result } = renderHook(() => usePlayerControls(), { wrapper });

    act(() => {
      result.current.handleReplay();
      result.current.handleReplay();
    });

    expect(result.current.replayCount).toBe(2);
    expect(resetStructuresStateMock).toHaveBeenCalledTimes(2);
  });
});
