import { describe, expect, it } from "vitest";

import { createMaskStrategyGrid } from "#/shared/ui/effects/thanosDisintegrate/maskStrategies";

describe("maskStrategies", () => {
  it("builds a centerOut grid with increasing distance from the center", () => {
    const { grid } = createMaskStrategyGrid("centerOut", 5, 5);
    const centerValue = grid[2]![2]!;

    expect(grid[0]![0]).toBeGreaterThanOrEqual(centerValue);
    expect(grid[4]![4]).toBeGreaterThanOrEqual(centerValue);
    expect(grid[0]![0]).toBeGreaterThan(centerValue);
  });

  it("builds a leftToRight grid with monotonic columns", () => {
    const { grid } = createMaskStrategyGrid("leftToRight", 4, 2);

    expect(grid[0]![0]).toBeLessThan(grid[0]![3]!);
    expect(grid[1]![0]).toBeLessThan(grid[1]![3]!);
  });

  it("builds a random grid with values in [0, 1]", () => {
    const { grid } = createMaskStrategyGrid("random", 5, 5);

    for (const row of grid) {
      for (const cell of row) {
        expect(cell).toBeGreaterThanOrEqual(0);
        expect(cell).toBeLessThanOrEqual(1);
      }
    }
  });
});
