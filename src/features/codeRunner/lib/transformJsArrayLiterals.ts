import { type NodePath } from "@babel/traverse";
import * as babelTypes from "@babel/types";

const ARRAY_LITERAL_HELPER = "__dstructArrayLiteral";
const ARRAY_LITERAL_NAMED_HELPER = "__dstructArrayLiteralWithName";

/**
 * Single string literal as the only element is ambiguous with `__dstructArrayLiteralWithName("label", "x")`.
 */
const shouldUseUnnamedArrayLiteralHelper = (
  elements: ReadonlyArray<
    babelTypes.Expression | babelTypes.SpreadElement | null
  >,
): boolean => {
  if (elements.length !== 1) return false;
  const only = elements[0];
  if (only === null) return false;
  return babelTypes.isStringLiteral(only);
};

const tryInferBindingNameFromArrayLiteralPath = (
  path: NodePath<babelTypes.ArrayExpression>,
): string | null => {
  const parent = path.parent;
  if (
    babelTypes.isVariableDeclarator(parent) &&
    babelTypes.isIdentifier(parent.id)
  ) {
    return parent.id.name;
  }
  if (
    babelTypes.isAssignmentExpression(parent) &&
    parent.operator === "=" &&
    babelTypes.isIdentifier(parent.left)
  ) {
    return parent.left.name;
  }
  if (
    babelTypes.isAssignmentPattern(parent) &&
    babelTypes.isIdentifier(parent.left)
  ) {
    return parent.left.name;
  }
  return null;
};

/**
 * Replace `[a, b, ...rest]` with `__dstructArrayLiteral(a, b, ...rest)` inside the solution
 * function so literals use the proxied `Array` (tracked), matching Python `TrackedList` behavior.
 * When the literal is the RHS of a simple binding (`const x = [...]`, `x = [...]`, default param),
 * uses `__dstructArrayLiteralWithName("x", ...)` so the viewer can show the variable name.
 * Runs before line probes so locations stay aligned with user source.
 */
export const transformArrayLiteralsInSolution = (
  solutionPath: NodePath<
    babelTypes.FunctionExpression | babelTypes.ArrowFunctionExpression
  >,
): void => {
  solutionPath.traverse({
    ArrayExpression(path: NodePath<babelTypes.ArrayExpression>) {
      const { node, parent } = path;

      if (
        babelTypes.isObjectProperty(parent) &&
        parent.computed &&
        parent.key === node
      ) {
        return;
      }

      const args: Array<babelTypes.Expression | babelTypes.SpreadElement> = [];
      for (const element of node.elements) {
        if (element === null) {
          args.push(babelTypes.identifier("undefined"));
        } else if (babelTypes.isSpreadElement(element)) {
          args.push(element);
        } else {
          args.push(element);
        }
      }

      const bindingName = tryInferBindingNameFromArrayLiteralPath(path);
      const useNamed =
        bindingName !== null &&
        !shouldUseUnnamedArrayLiteralHelper(node.elements);

      path.replaceWith(
        useNamed
          ? babelTypes.callExpression(
              babelTypes.identifier(ARRAY_LITERAL_NAMED_HELPER),
              [babelTypes.stringLiteral(bindingName), ...args],
            )
          : babelTypes.callExpression(
              babelTypes.identifier(ARRAY_LITERAL_HELPER),
              args,
            ),
      );
    },
  });
};
