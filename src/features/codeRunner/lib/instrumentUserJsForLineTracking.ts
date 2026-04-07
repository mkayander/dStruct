import generate from "@babel/generator";
import { parse } from "@babel/parser";
import traverse, { type NodePath } from "@babel/traverse";
import * as t from "@babel/types";

import type { Node } from "@babel/types";

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

/**
 * Injects `self.__dstructSetExecutionSource(line, column)` before each statement in
 * every function body. Line/column match the Monaco model (user code only).
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

    traverse(ast, {
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

    const out = generate(ast as Node, { retainLines: false });
    return { code: out.code, ok: true };
  } catch {
    return { code, ok: false };
  }
};
