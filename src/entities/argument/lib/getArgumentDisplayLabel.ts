import type { ArgumentObject } from "#/entities/argument/model/types";

/**
 * User-visible argument name. Multiple arguments may share the same label;
 * `ArgumentObject.name` remains the unique store key.
 */
export const getArgumentDisplayLabel = (arg: ArgumentObject): string => {
  const trimmed = arg.label?.trim();
  if (trimmed) return trimmed;
  return `arg-${arg.order + 1}`;
};
