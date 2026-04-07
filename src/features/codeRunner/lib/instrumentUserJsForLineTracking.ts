import generate from "@babel/generator";
import { parse } from "@babel/parser";
import traverse, { type NodePath } from "@babel/traverse";
import * as t from "@babel/types";

import type { File } from "@babel/types";

const insertProbesInBlock = (bodyPath: NodePath<t.BlockStatement>) => {
  const statements = bodyPath.get("body");
  if (!Array.isArray(statements)) return;

  for (let i = statements.length - 1; i >= 0; i -= 1) {
    const stmtPath = statements[i];
    if (!stmtPath) continue;
    const node = stmtPath.node;
    const loc = node.loc?.start;
    if (!loc) continue;

    stmtPath.insertBefore(
      t.expressionStatement(
        t.callExpression(
          t.memberExpression(
            t.identifier("globalThis"),
            t.identifier("__dstructSetExecutionSource"),
          ),
          [t.numericLiteral(loc.line), t.numericLiteral(loc.column)],
        ),
      ),
    );
  }
};

const instrumentFunctionBody = (fnPath: NodePath<t.Function>) => {
  const bodyPath = fnPath.get("body");
  if (bodyPath.isBlockStatement()) {
    insertProbesInBlock(bodyPath);
  }
};

type SolutionFnPath = NodePath<t.FunctionExpression | t.ArrowFunctionExpression>;

const findReturnedSolutionPath = (file: File): SolutionFnPath | null => {
  let found: SolutionFnPath | null = null;
  traverse(file, {
    ReturnStatement(path) {
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

/**
 * Injects `globalThis.__dstructSetExecutionSource(line, column)` before each statement
 * in every function body **inside** the first `return <function>` (dStruct solution template).
 * Line/column match the Monaco model (user code only).
 */
export const instrumentUserJsForLineTracking = (
  code: string,
): { code: string; ok: boolean } => {
  try {
    const ast = parse(code, {
      sourceType: "unambiguous",
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true,
    });

    const solutionPath = findReturnedSolutionPath(ast);
    if (!solutionPath) {
      return { code, ok: false };
    }

    // traverse() does not visit the root path; instrument the solution fn itself first.
    instrumentFunctionBody(solutionPath as NodePath<t.Function>);

    solutionPath.traverse({
      FunctionDeclaration(path) {
        instrumentFunctionBody(path);
      },
      FunctionExpression(path) {
        instrumentFunctionBody(path);
      },
      ArrowFunctionExpression(path) {
        const body = path.get("body");
        if (body.isBlockStatement()) {
          insertProbesInBlock(body);
        }
      },
    });

    const out = generate(ast, { retainLines: false });
    return { code: out.code, ok: true };
  } catch {
    return { code, ok: false };
  }
};
