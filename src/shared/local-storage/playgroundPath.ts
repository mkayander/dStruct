import { createStringStorage } from "#/shared/browser-storage";
import {
  getRestorablePlaygroundPath,
  isValidLastPlaygroundPath,
} from "#/shared/lib/playgroundLastPath";
import {
  clearLastPlaygroundPathCookie,
  setLastPlaygroundPathCookie,
} from "#/shared/lib/playgroundLastPathCookie";
import { PLAYGROUND_PUBLIC_BASE_PATH } from "#/shared/lib/playgroundRoute";

export { getRestorablePlaygroundPath, isValidLastPlaygroundPath };

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
  setLastPlaygroundPathCookie(path);
};

export const removeLastPlaygroundPath = (): void => {
  lastPlaygroundPathStorage.remove();
  clearLastPlaygroundPathCookie();
};
