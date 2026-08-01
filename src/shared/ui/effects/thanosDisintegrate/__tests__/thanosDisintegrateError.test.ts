import { describe, expect, it } from "vitest";

import {
  ThanosDisintegrateError,
  type ThanosDisintegrateErrorCode,
} from "#/shared/ui/effects/thanosDisintegrate/thanosDisintegrateError";

describe("ThanosDisintegrateError", () => {
  it("exposes a stable error code for callers", () => {
    const code: ThanosDisintegrateErrorCode = "canvas_unavailable";
    const error = new ThanosDisintegrateError(
      code,
      "2D canvas context is unavailable.",
    );

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ThanosDisintegrateError");
    expect(error.code).toBe("canvas_unavailable");
    expect(error.message).toBe("2D canvas context is unavailable.");
  });
});
