import { describe, expect, it } from "vitest";

import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { arrayStructureSlice } from "#/entities/dataStructures/array/model/arraySlice";

describe("arrayStructureSlice.create displayLabel", () => {
  it("persists displayLabel from runtime addArray options", () => {
    const state = arrayStructureSlice.reducer(
      {},
      arrayStructureSlice.actions.create({
        name: "runtime-array",
        data: {
          argType: ArgumentType.ARRAY,
          options: { displayLabel: "array" },
        },
      }),
    );

    expect(state["runtime-array"]?.displayLabel).toBe("array");
    expect(state["runtime-array"]?.isRuntime).toBe(true);
  });

  it("omits displayLabel when options are absent", () => {
    const state = arrayStructureSlice.reducer(
      {},
      arrayStructureSlice.actions.create({
        name: "runtime-array",
        data: { argType: ArgumentType.ARRAY },
      }),
    );

    expect(state["runtime-array"]?.displayLabel).toBeUndefined();
  });

  it("updates displayLabel via setDisplayLabel", () => {
    const created = arrayStructureSlice.reducer(
      {},
      arrayStructureSlice.actions.init({
        name: "arg-id",
        order: 0,
        argType: ArgumentType.STRING,
        displayLabel: "arg-1",
      }),
    );

    const state = arrayStructureSlice.reducer(
      created,
      arrayStructureSlice.actions.setDisplayLabel({
        name: "arg-id",
        data: { displayLabel: "num1" },
      }),
    );

    expect(state["arg-id"]?.displayLabel).toBe("num1");
  });
});
