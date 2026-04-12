import type { ArgumentObject } from "#/entities/argument/model/types";

/**
 * Stable identity for "same test case arguments" - entity adapter `setAll` produces new
 * entity state (and thus new `selectAll` arrays) even when logical args are unchanged
 * (e.g. ArgsEditor re-dispatching from React Query). Use this instead of comparing `args`
 * by reference when deciding whether user-visible derived state (e.g. callstack) should reset.
 */
export const buildCaseArgsContentSignature = (
  projectId: string | null,
  caseId: string | null,
  argumentsList: readonly ArgumentObject[],
): string => {
  const normalizedArguments = [...argumentsList]
    .map((argument) => ({
      name: argument.name,
      parentName: argument.parentName ?? null,
      order: argument.order,
      type: argument.type,
      input: argument.input,
    }))
    .sort((leftArgument, rightArgument) => {
      if (leftArgument.order !== rightArgument.order) {
        return leftArgument.order - rightArgument.order;
      }
      return leftArgument.name.localeCompare(rightArgument.name);
    });

  return JSON.stringify({
    projectId,
    caseId,
    arguments: normalizedArguments,
  });
};
