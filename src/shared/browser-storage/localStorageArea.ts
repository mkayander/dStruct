import { runOnClient } from "#/shared/browser-storage/runOnClient";
import type { StorageArea } from "#/shared/browser-storage/types";

const keyListeners = new Map<string, Set<() => void>>();

const notifyKeyListeners = (key: string) => {
  keyListeners.get(key)?.forEach((listener) => listener());
};

const getOrCreateListenerSet = (key: string): Set<() => void> => {
  const existing = keyListeners.get(key);
  if (existing) {
    return existing;
  }

  const created = new Set<() => void>();
  keyListeners.set(key, created);
  return created;
};

export const createLocalStorageArea = (): StorageArea => ({
  getRaw: (key) => runOnClient(() => localStorage.getItem(key)),

  setRaw: (key, value) =>
    runOnClient(() => {
      try {
        localStorage.setItem(key, value);
        notifyKeyListeners(key);
        return true;
      } catch {
        return false;
      }
    }) ?? false,

  remove: (key) => {
    runOnClient(() => {
      try {
        localStorage.removeItem(key);
        notifyKeyListeners(key);
      } catch {
        // Ignore storage errors (private mode, quota).
      }
    });
  },

  subscribe: (key, listener) => {
    const listeners = getOrCreateListenerSet(key);
    listeners.add(listener);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === key) {
        listener();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage);
    }

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        keyListeners.delete(key);
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage);
      }
    };
  },
});

export const localStorageArea = createLocalStorageArea();
