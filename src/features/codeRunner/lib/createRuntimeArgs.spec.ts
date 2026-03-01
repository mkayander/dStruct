import { ArgumentType } from "#/entities/argument/model/argumentObject";
import type { ArgumentObject } from "#/entities/argument/model/types";

import { createPythonRuntimeArgs } from "./createPythonRuntimeArgs";
import { createRawRuntimeArgs } from "./createRawRuntimeArgs";

function arg(type: ArgumentType, input: string, name = "arg"): ArgumentObject {
  return { name, type, order: 0, input };
}

describe("createPythonRuntimeArgs", () => {
  it("throws on invalid JSON for ARRAY type", () => {
    expect(() =>
      createPythonRuntimeArgs([arg(ArgumentType.ARRAY, "[invalid")]),
    ).toThrow(SyntaxError);
  });

  it("throws on invalid JSON for BINARY_TREE type", () => {
    expect(() =>
      createPythonRuntimeArgs([arg(ArgumentType.BINARY_TREE, "not json")]),
    ).toThrow(SyntaxError);
  });

  it("parses valid JSON for ARRAY type", () => {
    const result = createPythonRuntimeArgs([
      arg(ArgumentType.ARRAY, "[1, 2, 3]"),
    ]);
    expect(result[0].value).toEqual([1, 2, 3]);
  });

  it("returns empty array when input is empty for ARRAY type", () => {
    const result = createPythonRuntimeArgs([arg(ArgumentType.ARRAY, "")]);
    expect(result[0].value).toEqual([]);
  });

  it("returns null when input is empty for BINARY_TREE type", () => {
    const result = createPythonRuntimeArgs([arg(ArgumentType.BINARY_TREE, "")]);
    expect(result[0].value).toBeNull();
  });
});

describe("createRawRuntimeArgs", () => {
  it("throws on invalid JSON for ARRAY type", () => {
    expect(() =>
      createRawRuntimeArgs([arg(ArgumentType.ARRAY, "[invalid")]),
    ).toThrow(SyntaxError);
  });

  it("throws on empty string for ARRAY type", () => {
    expect(() => createRawRuntimeArgs([arg(ArgumentType.ARRAY, "")])).toThrow(
      SyntaxError,
    );
  });

  it("parses valid JSON for ARRAY type", () => {
    const result = createRawRuntimeArgs([arg(ArgumentType.ARRAY, "[1, 2, 3]")]);
    expect(result[0]).toEqual([1, 2, 3]);
  });

  it("parses valid JSON for BINARY_TREE type", () => {
    const result = createRawRuntimeArgs([
      arg(ArgumentType.BINARY_TREE, "[1,2,3]"),
    ]);
    expect(result[0]).toEqual([1, 2, 3]);
  });
});
