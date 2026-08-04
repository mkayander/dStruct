import traverse, { type NodePath } from "@babel/traverse";
import type { File } from "@babel/types";
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

const ASSIGNMENT_OPERATORS_WITH_BINDING = new Set(["=", "??=", "||=", "&&="]);

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
    ASSIGNMENT_OPERATORS_WITH_BINDING.has(parent.operator) &&
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

const getNewArrayElementArguments = (
  args: babelTypes.NewExpression["arguments"],
): babelTypes.Expression[] => {
  const elements: babelTypes.Expression[] = [];
  for (const arg of args) {
    if (
      arg &&
      babelTypes.isExpression(arg) &&
      !babelTypes.isSpreadElement(arg)
    ) {
      elements.push(arg);
    }
  }
  return elements;
};

/** `new Array(10)` — numeric literal is a length, not an element. */
const isArrayLengthConstructor = (node: babelTypes.NewExpression): boolean => {
  const elements = getNewArrayElementArguments(node.arguments);
  return elements.length === 1 && babelTypes.isNumericLiteral(elements[0]);
};

/**
 * Prefer `__dstructArrayLiteralWithName` over `new Array(..., { displayLabel })` when
 * arguments are clearly element values (`[]`, `[1,2]`, `["x"]`). Dynamic single-arg
 * forms like `new Array(n)` must stay as constructors (length), with displayLabel appended.
 */
const shouldUseNamedLiteralForNewArray = (
  node: babelTypes.NewExpression,
): boolean => {
  const elements = getNewArrayElementArguments(node.arguments);
  if (elements.length === 0) return true;
  if (elements.length === 1) {
    return babelTypes.isStringLiteral(elements[0]);
  }
  return true;
};

/**
 * Ephemeral tuple on the RHS of destructuring (e.g. `[a, b] = [b, a]`) must stay a plain
 * array. Tracking it links tracked argument structures as nested children and renders a
 * phantom matrix in the viewer.
 */
const isDestructuringArrayLiteralRhs = (
  path: NodePath<babelTypes.ArrayExpression>,
): boolean => {
  const { node, parent } = path;
  if (
    babelTypes.isAssignmentExpression(parent) &&
    ASSIGNMENT_OPERATORS_WITH_BINDING.has(parent.operator) &&
    parent.right === node &&
    babelTypes.isArrayPattern(parent.left)
  ) {
    return true;
  }
  if (
    babelTypes.isVariableDeclarator(parent) &&
    parent.init === node &&
    babelTypes.isArrayPattern(parent.id)
  ) {
    return true;
  }
  return false;
};

const replaceWithNamedArrayLiteral = (
  path: NodePath<babelTypes.NewExpression>,
  bindingName: string,
  elements: babelTypes.Expression[],
): void => {
  path.replaceWith(
    babelTypes.callExpression(
      babelTypes.identifier(ARRAY_LITERAL_NAMED_HELPER),
      [babelTypes.stringLiteral(bindingName), ...elements],
    ),
  );
};

/**
 * Replace `[a, b, ...rest]` with `__dstructArrayLiteral(a, b, ...rest)` inside the solution
 * function so literals use the proxied `Array` (tracked), matching Python `TrackedList` behavior.
 * When the literal is the RHS of a simple binding (`const x = [...]`, `x = [...]`, default param),
 * uses `__dstructArrayLiteralWithName("x", ...)` so the viewer can show the variable name.
 *
 * Also rewrites inferable `new Array(...)` / `new ArrayProxy(...)` to tracked literals, or
 * appends `{ displayLabel }` for dynamic `new Array(lengthExpr)` forms.
 * Runs before line probes so locations stay aligned with user source.
 */
export const transformArrayLiteralsInFunction = (
  functionPath: NodePath<babelTypes.Function>,
): void => {
  functionPath.traverse({
    ArrayExpression(path: NodePath<babelTypes.ArrayExpression>) {
      const { node, parent } = path;

      if (
        babelTypes.isObjectProperty(parent) &&
        parent.computed &&
        parent.key === node
      ) {
        return;
      }

      if (isDestructuringArrayLiteralRhs(path)) {
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

      if (isArrayLengthConstructor(node)) {
        return;
      }

      const elementArgs = getNewArrayElementArguments(node.arguments);
      if (shouldUseNamedLiteralForNewArray(node)) {
        replaceWithNamedArrayLiteral(path, bindingName, elementArgs);
        return;
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

export const transformArrayLiteralsInSolution = (
  solutionPath: NodePath<
    babelTypes.FunctionExpression | babelTypes.ArrowFunctionExpression
  >,
): void => {
  transformArrayLiteralsInFunction(
    solutionPath as NodePath<babelTypes.Function>,
  );
};

/** Fallback when the solution template (`return function …`) is missing. */
export const transformArrayLiteralsInProgram = (file: File): void => {
  traverse(file, {
    "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression"(path) {
      transformArrayLiteralsInFunction(path as NodePath<babelTypes.Function>);
    },
  });
};
