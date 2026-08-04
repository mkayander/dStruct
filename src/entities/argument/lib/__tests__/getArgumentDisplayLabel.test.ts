import { describe, expect, it } from "vitest";

import { getArgumentDisplayLabel } from "#/entities/argument/lib/getArgumentDisplayLabel";
import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentObject } from "#/entities/argument/model/types";

const makeArg = (
  overrides: Partial<ArgumentObject> & Pick<ArgumentObject, "order">,
): ArgumentObject => ({
  name: "uuid-key",
  type: ArgumentType.ARRAY,
  input: "[]",
  ...overrides,
});

describe("getArgumentDisplayLabel", () => {
  it("returns trimmed custom label when set", () => {
    expect(
      getArgumentDisplayLabel(makeArg({ order: 0, label: "  head  " })),
    ).toBe("head");
  });

  it("falls back to arg-N when label is missing or blank", () => {
    expect(getArgumentDisplayLabel(makeArg({ order: 0 }))).toBe("arg-1");
    expect(getArgumentDisplayLabel(makeArg({ order: 2 }))).toBe("arg-3");
    expect(getArgumentDisplayLabel(makeArg({ order: 0, label: "" }))).toBe(
      "arg-1",
    );
    expect(getArgumentDisplayLabel(makeArg({ order: 0, label: "   " }))).toBe(
      "arg-1",
    );
  });

  it("allows duplicate labels across arguments (store keys stay unique)", () => {
    const first = makeArg({ order: 0, name: "a", label: "nums" });
    const second = makeArg({ order: 1, name: "b", label: "nums" });
    expect(getArgumentDisplayLabel(first)).toBe("nums");
    expect(getArgumentDisplayLabel(second)).toBe("nums");
    expect(first.name).not.toBe(second.name);
  });

  it("uses solution parameter names for top-level args when label is unset", () => {
    expect(
      getArgumentDisplayLabel(makeArg({ order: 0 }), ["num1", "num2"]),
    ).toBe("num1");
    expect(
      getArgumentDisplayLabel(makeArg({ order: 1 }), ["num1", "num2"]),
    ).toBe("num2");
  });

  it("ignores parameter names for nested args (e.g. matrix rows)", () => {
    expect(
      getArgumentDisplayLabel(makeArg({ order: 1, parentName: "matrix-id" }), [
        "grid",
      ]),
    ).toBe("arg-2");
  });

  it("prefers explicit label over solution parameter names", () => {
    expect(
      getArgumentDisplayLabel(makeArg({ order: 0, label: "custom" }), ["num1"]),
    ).toBe("custom");
  });
});
