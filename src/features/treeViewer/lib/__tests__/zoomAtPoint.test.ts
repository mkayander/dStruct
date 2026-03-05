import { describe, expect, it } from "vitest";

import { MAX_ZOOM, MIN_ZOOM } from "../../model/editorConstants";
import { computeZoomAtPoint } from "../zoomAtPoint";

describe("computeZoomAtPoint", () => {
  it("should update scale and offset to keep point fixed", () => {
    const result = computeZoomAtPoint(
      { offsetX: 0, offsetY: 0, scale: 1 },
      200,
      100,
      100,
      50,
      2,
    );

    expect(result.scale).toBe(2);
    expect(result.offsetX).not.toBe(0);
    expect(result.offsetY).not.toBe(0);
  });

  it("should clamp scale to valid range", () => {
    const resultHigh = computeZoomAtPoint(
      { offsetX: 0, offsetY: 0, scale: 1 },
      100,
      100,
      0,
      0,
      10,
    );
    expect(resultHigh.scale).toBe(MAX_ZOOM);

    const resultLow = computeZoomAtPoint(
      { offsetX: 0, offsetY: 0, scale: 1 },
      100,
      100,
      0,
      0,
      0.1,
    );
    expect(resultLow.scale).toBe(MIN_ZOOM);
  });
});
