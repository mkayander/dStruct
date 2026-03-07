import { toErrorInfo } from "../useCodeExecution";

describe("useCodeExecution", () => {
  describe("toErrorInfo", () => {
    it("extracts name, message, stack from Error", () => {
      const err = new Error("test message");
      err.name = "CustomError";
      const result = toErrorInfo(err);
      expect(result).toEqual({
        name: "CustomError",
        message: "test message",
        stack: err.stack,
      });
    });

    it("handles string errors", () => {
      expect(toErrorInfo("something went wrong")).toEqual({
        name: "Error",
        message: "something went wrong",
      });
    });

    it("handles unknown errors with fallback message", () => {
      expect(toErrorInfo({ foo: "bar" })).toEqual({
        name: "Error",
        message: "An unexpected error occurred",
      });
    });
  });
});
