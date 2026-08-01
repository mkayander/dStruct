import { describe, expect, it } from "vitest";

import {
  DomDisintegrateError,
  type DomDisintegrateErrorCode,
} from "#/shared/ui/effects/domDisintegrate/domDisintegrateError";

describe("DomDisintegrateError", () => {
  it("exposes a stable error code for callers", () => {
    const code: DomDisintegrateErrorCode = "canvas_unavailable";
    const error = new DomDisintegrateError(
      code,
      "2D canvas context is unavailable.",
    );

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("DomDisintegrateError");
    expect(error.code).toBe("canvas_unavailable");
    expect(error.message).toBe("2D canvas context is unavailable.");
  });
});
