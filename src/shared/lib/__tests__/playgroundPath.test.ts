import { describe, expect, it } from "vitest";

import {
  getLastPlaygroundPath,
  getRestorablePlaygroundPath,
  isValidLastPlaygroundPath,
  PLAYGROUND_BASE_PATH,
} from "../../local-storage/playgroundPath";

describe("playgroundPath", () => {
  describe("getLastPlaygroundPath", () => {
    it("returns value from localStorage when window is defined", () => {
      localStorage.setItem("lastPlaygroundPath", "/playground/my-project");
      expect(getLastPlaygroundPath()).toBe("/playground/my-project");
    });

    it("returns null when localStorage has no value", () => {
      localStorage.removeItem("lastPlaygroundPath");
      expect(getLastPlaygroundPath()).toBe(null);
    });
  });

  describe("PLAYGROUND_BASE_PATH", () => {
    it("is /playground", () => {
      expect(PLAYGROUND_BASE_PATH).toBe("/playground");
    });
  });

  describe("isValidLastPlaygroundPath", () => {
    it("returns true for path with project slug", () => {
      expect(isValidLastPlaygroundPath("/playground/some-project")).toBe(true);
      expect(isValidLastPlaygroundPath("/playground/foo/bar/baz")).toBe(true);
    });

    it("returns false for null or empty", () => {
      expect(isValidLastPlaygroundPath(null)).toBe(false);
      expect(isValidLastPlaygroundPath("")).toBe(false);
    });

    it("returns false when path does not start with base path", () => {
      expect(isValidLastPlaygroundPath("/other/path")).toBe(false);
      expect(isValidLastPlaygroundPath("playground/foo")).toBe(false);
    });

    it("returns false when path has no project slug segment", () => {
      expect(isValidLastPlaygroundPath("/playground/")).toBe(false);
      expect(isValidLastPlaygroundPath("/playground")).toBe(false);
    });
  });

  describe("getRestorablePlaygroundPath", () => {
    it("returns path when valid and project slug does not start with [[", () => {
      const path = "/playground/some-project";
      expect(getRestorablePlaygroundPath(path)).toBe(path);
    });

    it("returns null when path is invalid", () => {
      expect(getRestorablePlaygroundPath(null)).toBe(null);
      expect(getRestorablePlaygroundPath("")).toBe(null);
      expect(getRestorablePlaygroundPath("/playground/")).toBe(null);
      expect(getRestorablePlaygroundPath("/other/path")).toBe(null);
    });

    it("returns null when project slug starts with [[ (Next.js catch-all)", () => {
      const path = "/playground/[[...slug]]";
      expect(getRestorablePlaygroundPath(path)).toBe(null);
    });
  });
});
