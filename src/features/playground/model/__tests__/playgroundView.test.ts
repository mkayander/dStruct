import {
  isPlaygroundView,
  PLAYGROUND_VIEW_PARAM_OPTIONS,
} from "../playgroundView";

describe("playgroundView", () => {
  describe("isPlaygroundView", () => {
    it("returns true for valid view values", () => {
      expect(isPlaygroundView("browse")).toBe(true);
      expect(isPlaygroundView("code")).toBe(true);
      expect(isPlaygroundView("results")).toBe(true);
    });

    it("returns false for invalid values", () => {
      expect(isPlaygroundView("")).toBe(false);
      expect(isPlaygroundView("invalid")).toBe(false);
      expect(isPlaygroundView(null)).toBe(false);
      expect(isPlaygroundView(undefined)).toBe(false);
    });
  });

  describe("PLAYGROUND_VIEW_PARAM_OPTIONS", () => {
    const { validate } = PLAYGROUND_VIEW_PARAM_OPTIONS;

    it("accepts empty string and valid views", () => {
      expect(validate("")).toBe(true);
      expect(validate("browse")).toBe(true);
      expect(validate("code")).toBe(true);
      expect(validate("results")).toBe(true);
    });

    it("rejects invalid view values", () => {
      expect(validate("invalid")).toBe(false);
      expect(validate(null)).toBe(false);
      expect(validate(undefined)).toBe(false);
    });
  });
});
