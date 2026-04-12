import { afterEach, describe, expect, it, vi } from "vitest";

import { createLatestOnlyTimeoutController } from "#/features/codeRunner/lib/createLatestOnlyTimeoutController";

describe("createLatestOnlyTimeoutController", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("clears a pending timeout before it fires", () => {
    vi.useFakeTimers();

    const controller = createLatestOnlyTimeoutController();
    const callback = vi.fn();

    controller.schedule(callback, 100);
    controller.clear();
    vi.advanceTimersByTime(100);

    expect(callback).not.toHaveBeenCalled();
  });

  it("keeps only the latest scheduled callback", () => {
    vi.useFakeTimers();

    const controller = createLatestOnlyTimeoutController();
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    controller.schedule(firstCallback, 100);
    controller.schedule(secondCallback, 100);
    vi.advanceTimersByTime(100);

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });

  it("marks an in-flight async task as stale after clear", async () => {
    vi.useFakeTimers();

    const controller = createLatestOnlyTimeoutController();
    const latestFlags: boolean[] = [];
    const task = vi.fn(async (isLatest: () => boolean) => {
      await Promise.resolve();
      latestFlags.push(isLatest());
    });

    controller.schedule(task, 100);
    vi.advanceTimersByTime(100);
    controller.clear();
    await Promise.resolve();

    expect(task).toHaveBeenCalledTimes(1);
    expect(latestFlags).toEqual([false]);
  });
});
