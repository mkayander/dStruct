import generate from "@babel/generator";
import { parse } from "@babel/parser";
import traverse, { type NodePath } from "@babel/traverse";
import type {
  ArrowFunctionExpression,
  File,
  FunctionExpression,
  ReturnStatement,
} from "@babel/types";
import { describe, expect, it } from "vitest";

import { transformArrayLiteralsInSolution } from "#/features/codeRunner/lib/transformJsArrayLiterals";

const findSolution = (
  ast: File,
): NodePath<FunctionExpression | ArrowFunctionExpression> | null => {
  let found: NodePath<FunctionExpression | ArrowFunctionExpression> | null =
    null;
  traverse(ast, {
    ReturnStatement(path: NodePath<ReturnStatement>) {
      const arg = path.get("argument");
      if (!arg.node) return;
      if (arg.isFunctionExpression() || arg.isArrowFunctionExpression()) {
        found = arg as NodePath<FunctionExpression | ArrowFunctionExpression>;
        path.stop();
      }
    },
  });
  return found;
};

describe("transformArrayLiteralsInSolution", () => {
  it("replaces [] and [1, 2, 3] with __dstructArrayLiteral calls", () => {
    const code = `return function f() {
  const a = [];
  const b = [1, 2, 3];
  return b;
};`;
    const ast = parse(code, {
      sourceType: "unambiguous",
      allowReturnOutsideFunction: true,
    });
    const solution = findSolution(ast);
    expect(solution).toBeTruthy();
    transformArrayLiteralsInSolution(solution!);
    const out = generate(ast).code;
    expect(out).toContain("__dstructArrayLiteral()");
    expect(out).toContain("__dstructArrayLiteral(1, 2, 3)");
  });

  it("preserves spread elements", () => {
    const code = `return function f(arr) {
  return [...arr, 4];
};`;
    const ast = parse(code, {
      sourceType: "unambiguous",
      allowReturnOutsideFunction: true,
    });
    const solution = findSolution(ast);
    transformArrayLiteralsInSolution(solution!);
    const out = generate(ast).code;
    expect(out).toContain("__dstructArrayLiteral(...arr, 4)");
  });

  it("does not replace array used as computed object key", () => {
    const code = `return function f() {
  const o = { [[1, 2]]: 0 };
  return o;
};`;
    const ast = parse(code, {
      sourceType: "unambiguous",
      allowReturnOutsideFunction: true,
    });
    const solution = findSolution(ast);
    transformArrayLiteralsInSolution(solution!);
    const out = generate(ast).code;
    expect(out).toContain("[[1, 2]]");
    expect(out).not.toContain("__dstructArrayLiteral(1, 2)");
  });
});
