import { localStorageArea } from "#/shared/browser-storage/localStorageArea";
import type {
  StorageArea,
  VersionedJsonBrowserStorage,
} from "#/shared/browser-storage/types";

type CreateVersionedJsonStorageOptions<TValue> = {
  key: string;
  version: number;
  parsePayload: (payload: unknown) => TValue | null;
  wrapPayload: (value: TValue) => Record<string, unknown>;
  area?: StorageArea;
};

const parseVersionedEnvelope = <TValue>(
  raw: string | null,
  version: number,
  parsePayload: (payload: unknown) => TValue | null,
): TValue | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("version" in parsed) ||
      (parsed as { version: unknown }).version !== version
    ) {
      return null;
    }

    return parsePayload(parsed);
  } catch {
    return null;
  }
};

export const createVersionedJsonStorage = <TValue>({
  key,
  version,
  parsePayload,
  wrapPayload,
  area = localStorageArea,
}: CreateVersionedJsonStorageOptions<TValue>): VersionedJsonBrowserStorage<TValue> => {
  const parseRaw = (raw: string | null) =>
    parseVersionedEnvelope(raw, version, parsePayload);

  return {
    key,
    version,
    get: () => parseRaw(area.getRaw(key)),
    set: (value) => {
      const envelope = {
        version,
        ...wrapPayload(value),
      };

      return area.setRaw(key, JSON.stringify(envelope));
    },
    remove: () => area.remove(key),
    getRaw: () => area.getRaw(key),
    parseRaw,
    subscribe: (listener) => area.subscribe(key, listener),
  };
};
