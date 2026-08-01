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
});
