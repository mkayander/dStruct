import { afterEach, describe, expect, it, vi } from "vitest";

const buildThanosCaptureMock = vi.fn();

vi.mock("#/shared/ui/effects/thanosDisintegrate/buildThanosCapture", () => ({
  buildThanosCapture: buildThanosCaptureMock,
}));

const { warmThanosCapture } =
  await import("#/shared/ui/effects/thanosDisintegrate/warmThanosCapture");

describe("warmThanosCapture", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("does not leave an unhandled rejection when warm capture fails", async () => {
    vi.useFakeTimers();
    buildThanosCaptureMock.mockRejectedValue(new Error("capture failed"));

    const element = document.createElement("div");
    const cacheRef = { current: null };

    const cancelWarm = warmThanosCapture(element, cacheRef);
    await vi.runAllTimersAsync();

    expect(cacheRef.current).toBeNull();
    cancelWarm();
  });
});
