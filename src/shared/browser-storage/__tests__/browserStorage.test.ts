import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createLocalStorageArea,
  createStringStorage,
  createVersionedJsonStorage,
} from "#/shared/browser-storage";

describe("browser-storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("createStringStorage", () => {
    it("reads and writes string values", () => {
      const storage = createStringStorage({
        key: "test-string",
        area: createLocalStorageArea(),
      });

      expect(storage.get()).toBeNull();
      expect(storage.set("hello")).toBe(true);
      expect(storage.get()).toBe("hello");
      storage.remove();
      expect(storage.get()).toBeNull();
    });

    it("notifies subscribers on same-tab updates", () => {
      const storage = createStringStorage({
        key: "test-string-notify",
        area: createLocalStorageArea(),
      });
      const listener = vi.fn();
      const unsubscribe = storage.subscribe(listener);

      storage.set("updated");

      expect(listener).toHaveBeenCalledTimes(1);
      unsubscribe();
    });
  });

  describe("createVersionedJsonStorage", () => {
    it("stores versioned JSON payloads", () => {
      const storage = createVersionedJsonStorage<{ enabled: boolean }>({
        key: "test-versioned",
        version: 2,
        parsePayload: (payload) => {
          if (
            typeof payload !== "object" ||
            payload === null ||
            !("enabled" in payload)
          ) {
            return null;
          }

          const { enabled } = payload as { enabled: unknown };
          return typeof enabled === "boolean" ? { enabled } : null;
        },
        wrapPayload: (value) => ({ enabled: value.enabled }),
        area: createLocalStorageArea(),
      });

      expect(storage.set({ enabled: true })).toBe(true);
      expect(storage.get()).toEqual({ enabled: true });
    });

    it("ignores payloads with a mismatched version", () => {
      const storage = createVersionedJsonStorage<{ enabled: boolean }>({
        key: "test-versioned-mismatch",
        version: 1,
        parsePayload: (payload) => {
          if (
            typeof payload !== "object" ||
            payload === null ||
            !("enabled" in payload)
          ) {
            return null;
          }

          const { enabled } = payload as { enabled: unknown };
          return typeof enabled === "boolean" ? { enabled } : null;
        },
        wrapPayload: (value) => ({ enabled: value.enabled }),
        area: createLocalStorageArea(),
      });

      localStorage.setItem(
        "test-versioned-mismatch",
        JSON.stringify({ version: 99, enabled: true }),
      );

      expect(storage.get()).toBeNull();
    });
  });
});
