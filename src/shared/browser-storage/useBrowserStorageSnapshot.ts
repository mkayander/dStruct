import { useMemo, useSyncExternalStore } from "react";

import type { BrowserStorageSnapshot } from "#/shared/browser-storage/types";

const getServerSnapshot = (): string | null => null;

export const useBrowserStorageSnapshot = <TValue>(
  storage: BrowserStorageSnapshot<TValue>,
): TValue | null => {
  const rawSnapshot = useSyncExternalStore(
    storage.subscribe,
    storage.getRaw,
    getServerSnapshot,
  );

  return useMemo(
    () => storage.parseRaw(rawSnapshot),
    [rawSnapshot, storage],
  );
};
