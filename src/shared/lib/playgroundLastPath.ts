import {
  parsePlaygroundPathname,
  remapPlaygroundPathToBase,
} from "#/shared/lib/playgroundRoute";

/** Returns true when the path is a playground URL with a project slug. */
export const isValidLastPlaygroundPath = (path: string | null): boolean => {
  const parsed = path ? parsePlaygroundPathname(path) : null;
  return Boolean(parsed?.slug[0]);
};

/**
 * Returns a restorable path for the current playground base (public or locale-prefixed).
 * Slug segments are preserved; only the prefix is remapped when `targetBasePath` is set.
 */
export const getRestorablePlaygroundPath = (
  path: string | null,
  targetBasePath?: string,
): string | null => {
  if (!isValidLastPlaygroundPath(path)) {
    return null;
  }
  if (targetBasePath) {
    return remapPlaygroundPathToBase(path!, targetBasePath);
  }
  const parsed = parsePlaygroundPathname(path!);
  const projectSlug = parsed?.slug[0];
  return projectSlug?.startsWith("[[") ? null : path;
};
