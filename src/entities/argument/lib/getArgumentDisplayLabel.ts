import type { ArgumentObject } from "#/entities/argument/model/types";

/**
 * User-visible argument name. Multiple arguments may share the same label;
 * `ArgumentObject.name` remains the unique store key.
 *
 * When `parameterNames` is provided (from the solution signature), top-level
 * arguments use the name at `parameterNames[arg.order]` before falling back to
 * `arg-${order + 1}`. Nested args (e.g. matrix rows) ignore `parameterNames`.
 */
export const getArgumentDisplayLabel = (
  arg: ArgumentObject,
  parameterNames?: readonly (string | undefined)[],
): string => {
  const trimmed = arg.label?.trim();
  if (trimmed) return trimmed;

  if (!arg.parentName && parameterNames) {
    const fromCode = parameterNames[arg.order]?.trim();
    if (fromCode) return fromCode;
  }

  return `arg-${arg.order + 1}`;
};
