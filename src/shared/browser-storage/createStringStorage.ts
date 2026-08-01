import { localStorageArea } from "#/shared/browser-storage/localStorageArea";
import type {
  StorageArea,
  StringBrowserStorage,
} from "#/shared/browser-storage/types";

type CreateStringStorageOptions = {
  key: string;
  area?: StorageArea;
};

export const createStringStorage = ({
  key,
  area = localStorageArea,
}: CreateStringStorageOptions): StringBrowserStorage => {
  const parseRaw = (raw: string | null): string | null => raw;

  return {
    key,
    get: () => area.getRaw(key),
    set: (value) => area.setRaw(key, value),
    remove: () => area.remove(key),
    getRaw: () => area.getRaw(key),
    parseRaw,
    subscribe: (listener) => area.subscribe(key, listener),
  };
};
