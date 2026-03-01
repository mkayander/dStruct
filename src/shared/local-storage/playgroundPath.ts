export const PLAYGROUND_BASE_PATH = "/playground";

const LAST_PLAYGROUND_PATH_KEY = "lastPlaygroundPath";

const getProjectSlug = (path: string): string | undefined => path.split("/")[2];

const runOnClient = <T>(fn: () => T): T | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return fn();
};

/**
 * Returns the last playground path from localStorage, or null on SSR / when not set.
 */
export const getLastPlaygroundPath = (): string | null =>
  runOnClient(() => localStorage.getItem(LAST_PLAYGROUND_PATH_KEY));

export const setLastPlaygroundPath = (path: string) => {
  runOnClient(() => localStorage.setItem(LAST_PLAYGROUND_PATH_KEY, path));
};

export const removeLastPlaygroundPath = () => {
  runOnClient(() => localStorage.removeItem(LAST_PLAYGROUND_PATH_KEY));
};

/**
 * Returns true if the path is a valid playground path with a project slug.
 * Used to decide if we have a "last project" to show (e.g. default view).
 */
export const isValidLastPlaygroundPath = (path: string | null): boolean => {
  if (!path?.startsWith(PLAYGROUND_BASE_PATH)) {
    return false;
  }

  const projectSlug = getProjectSlug(path);

  return Boolean(projectSlug);
};

/**
 * Returns the path if it can be restored (valid + project slug is not a Next.js catch-all).
 * Returns null otherwise.
 */
export const getRestorablePlaygroundPath = (
  path: string | null,
): string | null => {
  if (!isValidLastPlaygroundPath(path)) return null;
  const projectSlug = getProjectSlug(path!);
  return projectSlug?.startsWith("[[") ? null : path;
};
