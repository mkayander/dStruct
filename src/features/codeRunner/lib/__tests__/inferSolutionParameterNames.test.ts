import { describe, expect, it } from "vitest";

import {
  inferJsSolutionParameterNames,
  inferPythonSolutionParameterNames,
  inferSolutionParameterNames,
} from "#/features/codeRunner/lib/inferSolutionParameterNames";

describe("inferJsSolutionParameterNames", () => {
  it("reads parameter names from returned solution function", () => {
    const code = `/**
 * @param {string} num1
 */
return function addStrings(num1, num2) {
  return num1;
};`;

    expect(inferJsSolutionParameterNames(code)).toEqual(["num1", "num2"]);
  });

  it("returns undefined slots for destructuring parameters", () => {
    const code = `return function f([head], tail) {
  return head;
};`;

    expect(inferJsSolutionParameterNames(code)).toEqual([undefined, "tail"]);
  });

  it("returns null when no returned solution function exists", () => {
    expect(inferJsSolutionParameterNames("const x = 1;")).toBeNull();
  });
});

describe("inferPythonSolutionParameterNames", () => {
  it("reads names from def solve", () => {
    const code = `def solve(num1, num2):
    return num1
`;

    expect(inferPythonSolutionParameterNames(code)).toEqual(["num1", "num2"]);
  });

  it("reads names from def run (common tree problems)", () => {
    const code = `def run(head):
  if head is None:
    return 0
  return head.val
`;

    expect(inferPythonSolutionParameterNames(code)).toEqual(["head"]);
  });

  it("handles type annotations and default values", () => {
    const code = `def solve(head: TreeNode, depth: int = 0):
    return head
`;

    expect(inferPythonSolutionParameterNames(code)).toEqual(["head", "depth"]);
  });

  it("prefers solve over an earlier helper def", () => {
    const code = `def helper(x):
    return x

def solve(num1, num2):
    return num1
`;

    expect(inferPythonSolutionParameterNames(code)).toEqual(["num1", "num2"]);
  });
});

describe("inferSolutionParameterNames", () => {
  it("dispatches by language", () => {
    const js = `return function solve(nums) { return nums; };`;
    const py = `def solve(nums):\n  return nums\n`;

    expect(inferSolutionParameterNames(js, "javascript")).toEqual(["nums"]);
    expect(inferSolutionParameterNames(py, "python")).toEqual(["nums"]);
  });

  it("uses python entry when language is python", () => {
    const py = `def run(root):\n  return root.val\n`;

    expect(inferSolutionParameterNames(py, "python")).toEqual(["root"]);
    expect(inferSolutionParameterNames(py, "javascript")).toBeNull();
  });
});
