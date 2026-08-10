import { createStringStorage } from "#/shared/browser-storage";
import {
  parsePlaygroundPathname,
  PLAYGROUND_PUBLIC_BASE_PATH,
  remapPlaygroundPathToBase,
} from "#/shared/lib/playgroundRoute";

export const PLAYGROUND_BASE_PATH = PLAYGROUND_PUBLIC_BASE_PATH;

const lastPlaygroundPathStorage = createStringStorage({
  key: "lastPlaygroundPath",
});

/**
 * Returns the last playground path from localStorage, or null on SSR / when not set.
 */
export const getLastPlaygroundPath = (): string | null =>
  lastPlaygroundPathStorage.get();

export const setLastPlaygroundPath = (path: string): void => {
  lastPlaygroundPathStorage.set(path);
};

export const removeLastPlaygroundPath = (): void => {
  lastPlaygroundPathStorage.remove();
};

/**
 * Returns true if the path is a valid playground path with a project slug.
 * Used to decide if we have a "last project" to show (e.g. default view).
 */
export const isValidLastPlaygroundPath = (path: string | null): boolean => {
  const parsed = path ? parsePlaygroundPathname(path) : null;
  return Boolean(parsed?.slug[0]);
};

/**
 * Returns a restorable path for the current playground base (public or pilot).
 * Slug segments are preserved; only the prefix is remapped when `targetBasePath` is set.
 */
export const getRestorablePlaygroundPath = (
  path: string | null,
  targetBasePath?: string,
): string | null => {
  if (!isValidLastPlaygroundPath(path)) return null;
  if (targetBasePath) {
    return remapPlaygroundPathToBase(path!, targetBasePath);
  }
  const parsed = parsePlaygroundPathname(path!);
  const projectSlug = parsed?.slug[0];
  return projectSlug?.startsWith("[[") ? null : path;
};
