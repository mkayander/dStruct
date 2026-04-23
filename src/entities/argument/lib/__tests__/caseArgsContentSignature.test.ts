import { describe, expect, it } from "vitest";

import { buildCaseArgsContentSignature } from "#/entities/argument/lib/caseArgsContentSignature";
import { ArgumentType } from "#/entities/argument/model/argumentObject";

describe("buildCaseArgsContentSignature", () => {
  it("matches for the same logical args regardless of array or object identity", () => {
    const argumentA = {
      name: "head",
      order: 0,
      type: ArgumentType.BINARY_TREE,
      input: "[1,null,2]",
    };
    const argumentB = { ...argumentA };

    const first = buildCaseArgsContentSignature("p1", "c1", [argumentA]);
    const second = buildCaseArgsContentSignature("p1", "c1", [argumentB]);
    expect(second).toBe(first);
  });

  it("is insensitive to argument iteration order (sorted by key string)", () => {
    const tree = {
      name: "head",
      order: 0,
      type: ArgumentType.BINARY_TREE,
      input: "[]",
    };
    const array = {
      name: "nums",
      order: 1,
      type: ArgumentType.ARRAY,
      input: "[1,2]",
    };

    const forward = buildCaseArgsContentSignature("p", "c", [tree, array]);
    const reverse = buildCaseArgsContentSignature("p", "c", [array, tree]);
    expect(reverse).toBe(forward);
  });

  it("changes when project, case, or argument payload changes", () => {
    const argument = {
      name: "head",
      order: 0,
      type: ArgumentType.BINARY_TREE,
      input: "[]",
    };
    const base = buildCaseArgsContentSignature("p", "c", [argument]);

    expect(buildCaseArgsContentSignature("p2", "c", [argument])).not.toBe(base);
    expect(buildCaseArgsContentSignature("p", "c2", [argument])).not.toBe(base);
    expect(
      buildCaseArgsContentSignature("p", "c", [{ ...argument, input: "[1]" }]),
    ).not.toBe(base);
    expect(
      buildCaseArgsContentSignature("p", "c", [{ ...argument, label: "root" }]),
    ).not.toBe(base);
  });

  it("changes when parentName changes", () => {
    const baseArgument = {
      name: "head",
      order: 0,
      type: ArgumentType.BINARY_TREE,
      input: "[]",
    };
    const nestedArgument = {
      ...baseArgument,
      parentName: "root",
    };

    const base = buildCaseArgsContentSignature("p", "c", [baseArgument]);
    const nested = buildCaseArgsContentSignature("p", "c", [nestedArgument]);

    expect(nested).not.toBe(base);
  });
});
