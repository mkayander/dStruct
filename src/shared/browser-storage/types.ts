export type StorageArea = {
  getRaw: (key: string) => string | null;
  setRaw: (key: string, value: string) => boolean;
  remove: (key: string) => void;
  subscribe: (key: string, listener: () => void) => () => void;
};

export type BrowserStorageSnapshot<TValue> = {
  key: string;
  getRaw: () => string | null;
  parseRaw: (raw: string | null) => TValue | null;
  subscribe: (listener: () => void) => () => void;
};

export type StringBrowserStorage = {
  key: string;
  get: () => string | null;
  set: (value: string) => boolean;
  remove: () => void;
  getRaw: () => string | null;
  parseRaw: (raw: string | null) => string | null;
  subscribe: (listener: () => void) => () => void;
};

export type VersionedJsonBrowserStorage<TValue> = {
  key: string;
  version: number;
  get: () => TValue | null;
  set: (value: TValue) => boolean;
  remove: () => void;
  getRaw: () => string | null;
  parseRaw: (raw: string | null) => TValue | null;
  subscribe: (listener: () => void) => () => void;
};
