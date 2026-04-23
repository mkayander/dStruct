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
  it("uses __dstructArrayLiteralWithName when literal is RHS of const / assignment", () => {
    const code = `return function f() {
  const a = [];
  const b = [1, 2, 3];
  let c;
  c = [4];
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
    expect(out).toContain('__dstructArrayLiteralWithName("a")');
    expect(out).toContain('__dstructArrayLiteralWithName("b", 1, 2, 3)');
    expect(out).toContain('__dstructArrayLiteralWithName("c", 4)');
  });

  it("uses unnamed helper when only element is a string literal (avoid ambiguity)", () => {
    const code = `return function f() {
  const labels = ["one"];
  return labels;
};`;
    const ast = parse(code, {
      sourceType: "unambiguous",
      allowReturnOutsideFunction: true,
    });
    const solution = findSolution(ast);
    transformArrayLiteralsInSolution(solution!);
    const out = generate(ast).code;
    expect(out).toContain('__dstructArrayLiteral("one")');
    expect(out).not.toContain("__dstructArrayLiteralWithName");
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

  it("appends displayLabel object to new Array / new ArrayProxy when binding is inferable", () => {
    const code = `return function f() {
  const nums = new Array(1, 2, 3);
  const copy = new ArrayProxy(4, 5);
  return nums;
};`;
    const ast = parse(code, {
      sourceType: "unambiguous",
      allowReturnOutsideFunction: true,
    });
    const solution = findSolution(ast);
    transformArrayLiteralsInSolution(solution!);
    const out = generate(ast).code;
    expect(out).toMatch(/new Array\(1,\s*2,\s*3,\s*\{[^}]*displayLabel:\s*"nums"/);
    expect(out).toMatch(/new ArrayProxy\(4,\s*5,\s*\{[^}]*displayLabel:\s*"copy"/);
  });

  it("does not append displayLabel to ambiguous new Array(number) length form", () => {
    const code = `return function f() {
  const buf = new Array(10);
  return buf;
};`;
    const ast = parse(code, {
      sourceType: "unambiguous",
      allowReturnOutsideFunction: true,
    });
    const solution = findSolution(ast);
    transformArrayLiteralsInSolution(solution!);
    const out = generate(ast).code;
    expect(out).toContain("new Array(10)");
    expect(out).not.toContain("displayLabel");
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
