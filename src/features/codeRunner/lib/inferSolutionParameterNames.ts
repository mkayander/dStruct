import { parse } from "@babel/parser";
import traverse, { type NodePath } from "@babel/traverse";
import * as babelTypes from "@babel/types";
import type { File } from "@babel/types";

import type { ProgrammingLanguage } from "#/features/codeRunner/hooks/useCodeExecution";

type SolutionFnPath = NodePath<
  babelTypes.FunctionExpression | babelTypes.ArrowFunctionExpression
>;

/** Match Python runner entry points (`safe_exec` uses the first `FunctionDef`; these are the usual names). */
const PYTHON_ENTRY_FUNCTION_NAMES = ["solve", "run"] as const;

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

const parsePythonParameterSegment = (segment: string): string | undefined => {
  let raw = segment.trim();
  const equalsIndex = raw.indexOf("=");
  if (equalsIndex !== -1) {
    raw = raw.slice(0, equalsIndex).trim();
  }
  const colonIndex = raw.indexOf(":");
  if (colonIndex !== -1) {
    raw = raw.slice(0, colonIndex).trim();
  }
  raw = raw.replace(/^\*\*/, "").replace(/^\*/, "");
  if (raw === "" || raw === "self") return undefined;
  return raw;
};

const parsePythonParameterList = (
  paramsPart: string,
): (string | undefined)[] => {
  const trimmed = paramsPart.trim();
  if (trimmed === "") return [];
  return trimmed
    .split(",")
    .map((segment) => parsePythonParameterSegment(segment));
};

const findPythonDefParameterList = (code: string): string | null => {
  for (const entryName of PYTHON_ENTRY_FUNCTION_NAMES) {
    const pattern = new RegExp(
      `^\\s*def\\s+${entryName}\\s*\\(([^)]*)\\)\\s*:`,
      "m",
    );
    const match = code.match(pattern);
    if (match) {
      return match[1] ?? "";
    }
  }

  const fallback = code.match(/^\s*def\s+\w+\s*\(([^)]*)\)\s*:/m);
  return fallback?.[1] ?? null;
};

/** Parameter names from `def solve(a, b):` / `def run(head):`, in call order. */
export const inferPythonSolutionParameterNames = (
  code: string,
): (string | undefined)[] | null => {
  const paramsPart = findPythonDefParameterList(code);
  if (paramsPart === null) return null;
  return parsePythonParameterList(paramsPart);
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
