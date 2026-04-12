import { describe, expect, it } from "vitest";

import {
  clearExecutionSource,
  peekExecutionSourceForFrame,
  setExecutionSource,
} from "#/features/codeRunner/lib/executionSourceContext";

describe("executionSourceContext", () => {
  it("peek returns undefined after clear", () => {
    clearExecutionSource();
    expect(peekExecutionSourceForFrame()).toBeUndefined();
  });

  it("setExecutionSource updates peek; column omitted when null", () => {
    clearExecutionSource();
    setExecutionSource(4, 12);
    expect(peekExecutionSourceForFrame()).toEqual({ line: 4, column: 12 });

    setExecutionSource(5);
    expect(peekExecutionSourceForFrame()).toEqual({ line: 5 });

    setExecutionSource(6, null);
    expect(peekExecutionSourceForFrame()).toEqual({ line: 6 });
  });

  it("clear resets line so peek is undefined", () => {
    setExecutionSource(9, 0);
    clearExecutionSource();
    expect(peekExecutionSourceForFrame()).toBeUndefined();
  });
});
