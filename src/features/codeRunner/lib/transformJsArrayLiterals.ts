import { type NodePath } from "@babel/traverse";
import * as babelTypes from "@babel/types";

const ARRAY_LITERAL_HELPER = "__dstructArrayLiteral";
const ARRAY_LITERAL_NAMED_HELPER = "__dstructArrayLiteralWithName";

type InferableRhsPath =
  | NodePath<babelTypes.ArrayExpression>
  | NodePath<babelTypes.NewExpression>;

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

const tryInferBindingNameFromRhsPath = (
  path: InferableRhsPath,
): string | null => {
  const parent = path.parent;
  const node = path.node;
  if (
    babelTypes.isVariableDeclarator(parent) &&
    babelTypes.isIdentifier(parent.id) &&
    parent.init === node
  ) {
    return parent.id.name;
  }
  if (
    babelTypes.isAssignmentExpression(parent) &&
    parent.operator === "=" &&
    babelTypes.isIdentifier(parent.left) &&
    parent.right === node
  ) {
    return parent.left.name;
  }
  if (
    babelTypes.isAssignmentPattern(parent) &&
    babelTypes.isIdentifier(parent.left) &&
    parent.right === node
  ) {
    return parent.left.name;
  }
  return null;
};

const isTrackedArrayCallee = (
  callee: babelTypes.Expression | babelTypes.V8IntrinsicIdentifier,
): boolean => {
  if (babelTypes.isIdentifier(callee)) {
    return callee.name === "Array" || callee.name === "ArrayProxy";
  }
  return false;
};

/**
 * Replace `[a, b, ...rest]` with `__dstructArrayLiteral(a, b, ...rest)` inside the solution
 * function so literals use the proxied `Array` (tracked), matching Python `TrackedList` behavior.
 * When the literal is the RHS of a simple binding (`const x = [...]`, `x = [...]`, default param),
 * uses `__dstructArrayLiteralWithName("x", ...)` so the viewer can show the variable name.
 *
 * Also appends `{ displayLabel: "x" }` to `new Array(...)` / `new ArrayProxy(...)` when the name
 * is inferable so dynamic `new Array(1,2,3)` constructions get viewer labels (same as literals).
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

      const bindingName = tryInferBindingNameFromRhsPath(path);
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

    NewExpression(path: NodePath<babelTypes.NewExpression>) {
      const { node, parent } = path;
      if (!isTrackedArrayCallee(node.callee)) return;

      if (
        babelTypes.isObjectProperty(parent) &&
        parent.computed &&
        parent.key === node
      ) {
        return;
      }

      const lastArg = node.arguments.at(-1);
      if (
        lastArg &&
        babelTypes.isExpression(lastArg) &&
        !babelTypes.isSpreadElement(lastArg) &&
        babelTypes.isObjectExpression(lastArg)
      ) {
        const props = lastArg.properties;
        const onlyDisplayLabel =
          props.length === 1 &&
          babelTypes.isObjectProperty(props[0]) &&
          !props[0].computed &&
          babelTypes.isIdentifier(props[0].key, { name: "displayLabel" });
        if (onlyDisplayLabel) {
          return;
        }
      }

      const bindingName = tryInferBindingNameFromRhsPath(path);
      if (bindingName === null) return;

      if (node.arguments.length === 1) {
        const only = node.arguments[0];
        if (
          only &&
          babelTypes.isExpression(only) &&
          !babelTypes.isSpreadElement(only) &&
          babelTypes.isNumericLiteral(only)
        ) {
          return;
        }
      }

      const displayLabelObject = babelTypes.objectExpression([
        babelTypes.objectProperty(
          babelTypes.identifier("displayLabel"),
          babelTypes.stringLiteral(bindingName),
          false,
          true,
        ),
      ]);

      path.replaceWith(
        babelTypes.newExpression(node.callee, [
          ...node.arguments,
          displayLabelObject,
        ]),
      );
    },
  });
};
