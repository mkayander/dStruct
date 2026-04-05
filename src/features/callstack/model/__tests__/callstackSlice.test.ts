import { describe, expect, it } from "vitest";

import { callstackSlice } from "../callstackSlice";

describe("callstackSlice", () => {
  it("increments resetVersion when a reset is marked", () => {
    const state = callstackSlice.reducer(
      undefined,
      callstackSlice.actions.markReset(),
    );

    expect(state.resetVersion).toBe(1);
  });
});
