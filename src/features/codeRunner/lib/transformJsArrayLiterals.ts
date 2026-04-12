import { type NodePath } from "@babel/traverse";
import * as babelTypes from "@babel/types";

/**
 * Replace `[a, b, ...rest]` with `__dstructArrayLiteral(a, b, ...rest)` inside the solution
 * function so literals use the proxied `Array` (tracked), matching Python `TrackedList` behavior.
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

      path.replaceWith(
        babelTypes.callExpression(
          babelTypes.identifier("__dstructArrayLiteral"),
          args,
        ),
      );
    },
  });
};
