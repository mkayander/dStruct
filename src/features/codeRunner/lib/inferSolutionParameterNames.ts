import { parse } from "@babel/parser";
import traverse, { type NodePath } from "@babel/traverse";
import * as babelTypes from "@babel/types";
import type { File } from "@babel/types";

import type { ProgrammingLanguage } from "#/features/codeRunner/hooks/useCodeExecution";

type SolutionFnPath = NodePath<
  babelTypes.FunctionExpression | babelTypes.ArrowFunctionExpression
>;

const findReturnedSolutionPath = (file: File): SolutionFnPath | null => {
  let found: SolutionFnPath | null = null;
  traverse(file, {
    ReturnStatement(path: NodePath<babelTypes.ReturnStatement>) {
      const arg = path.get("argument");
      if (!arg.node) return;
      if (arg.isFunctionExpression() || arg.isArrowFunctionExpression()) {
        found = arg as SolutionFnPath;
        path.stop();
      }
    },
  });
  return found;
};

const extractJsParameterName = (param: babelTypes.Node): string | undefined => {
  if (babelTypes.isIdentifier(param)) {
    return param.name;
  }
  if (
    babelTypes.isAssignmentPattern(param) &&
    babelTypes.isIdentifier(param.left)
  ) {
    return param.left.name;
  }
  return undefined;
};

/** Parameter names from `return function solve(a, b) { … }`, in call order. */
export const inferJsSolutionParameterNames = (
  code: string,
): (string | undefined)[] | null => {
  try {
    const ast = parse(code, {
      sourceType: "unambiguous",
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true,
    });
    const solutionPath = findReturnedSolutionPath(ast);
    if (!solutionPath) return null;

    return solutionPath.node.params.map((param) =>
      extractJsParameterName(param),
    );
  } catch {
    return null;
  }
};

/** Parameter names from `def solve(a, b):`, in call order (first top-level def). */
export const inferPythonSolutionParameterNames = (
  code: string,
): (string | undefined)[] | null => {
  const defMatch = code.match(/^\s*def\s+\w+\s*\(([^)]*)\)\s*:/m);
  if (!defMatch) return null;

  const paramsPart = defMatch[1]?.trim() ?? "";
  if (paramsPart === "") return [];

  return paramsPart.split(",").map((segment) => {
    const rawName = segment.trim().split("=")[0]?.trim() ?? "";
    const name = rawName.replace(/^\*\*/, "").replace(/^\*/, "");
    if (name === "" || name === "self") return undefined;
    return name;
  });
};

export const inferSolutionParameterNames = (
  code: string,
  language: ProgrammingLanguage,
): (string | undefined)[] | null => {
  if (!code.trim()) return null;
  if (language === "python") {
    return inferPythonSolutionParameterNames(code);
  }
  return inferJsSolutionParameterNames(code);
};
