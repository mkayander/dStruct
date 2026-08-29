import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useDeferredClientMount } from "#/shared/hooks/useDeferredClientMount";

describe("useDeferredClientMount", () => {
  it("defers ready until the next animation frame", async () => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });

    const { result } = renderHook(() => useDeferredClientMount());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });
    expect(result.current.mountKey).toBe(1);
  });

  it("does not re-run mount effect when callback identity changes", async () => {
    const firstCleanup = vi.fn();
    const secondCleanup = vi.fn();
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });

    const { rerender, unmount } = renderHook(
      ({ cleanup }) => useDeferredClientMount(cleanup),
      { initialProps: { cleanup: firstCleanup } },
    );

    rerender({ cleanup: secondCleanup });

    expect(firstCleanup).not.toHaveBeenCalled();

    unmount();

    expect(firstCleanup).not.toHaveBeenCalled();
    expect(secondCleanup).toHaveBeenCalledTimes(1);
  });
});
