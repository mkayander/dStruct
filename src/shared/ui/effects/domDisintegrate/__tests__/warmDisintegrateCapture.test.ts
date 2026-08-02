import { afterEach, describe, expect, it, vi } from "vitest";

const buildDisintegrateCaptureMock = vi.fn();

vi.mock("#/shared/ui/effects/domDisintegrate/buildDisintegrateCapture", () => ({
  buildDisintegrateCapture: buildDisintegrateCaptureMock,
}));

const { warmDisintegrateCapture } =
  await import("#/shared/ui/effects/domDisintegrate/warmDisintegrateCapture");

describe("warmDisintegrateCapture", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("does not leave an unhandled rejection when warm capture fails", async () => {
    vi.useFakeTimers();
    buildDisintegrateCaptureMock.mockRejectedValue(new Error("capture failed"));

    const element = document.createElement("div");
    const cacheRef = { current: null };

    const cancelWarm = warmDisintegrateCapture(element, cacheRef);
    await vi.runAllTimersAsync();

    expect(cacheRef.current).toBeNull();
    cancelWarm();
  });
});
