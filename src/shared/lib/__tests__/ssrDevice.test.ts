import { describe, expect, it } from "vitest";

import {
  applyDeviceHintResponseHeaders,
  parseSsrDeviceTypeHeader,
  resolveSsrDeviceType,
} from "#/shared/lib/ssrDevice";

describe("ssrDevice", () => {
  describe("resolveSsrDeviceType", () => {
    it("prefers Sec-CH-UA-Mobile when present", () => {
      const headers = new Headers({ "sec-ch-ua-mobile": "?1" });
      expect(resolveSsrDeviceType(headers)).toBe("mobile");
    });

    it("falls back to mobile User-Agent", () => {
      const headers = new Headers({
        "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      });
      expect(resolveSsrDeviceType(headers)).toBe("mobile");
    });

    it("defaults to desktop when hints are absent", () => {
      expect(resolveSsrDeviceType(new Headers())).toBe("desktop");
    });
  });

  describe("parseSsrDeviceTypeHeader", () => {
    it("returns mobile or desktop when valid", () => {
      expect(parseSsrDeviceTypeHeader("mobile")).toBe("mobile");
      expect(parseSsrDeviceTypeHeader("desktop")).toBe("desktop");
    });

    it("returns undefined for missing or invalid values", () => {
      expect(parseSsrDeviceTypeHeader(null)).toBeUndefined();
      expect(parseSsrDeviceTypeHeader("tablet")).toBeUndefined();
    });
  });

  describe("applyDeviceHintResponseHeaders", () => {
    it("sets Accept-CH and Vary for client hint negotiation", () => {
      const response = { headers: new Headers() };
      applyDeviceHintResponseHeaders(response);

      expect(response.headers.get("Accept-CH")).toBe("Sec-CH-UA-Mobile");
      expect(response.headers.get("Vary")).toBe("User-Agent, Sec-CH-UA-Mobile");
    });

    it("merges with existing Accept-CH and Vary values", () => {
      const response = {
        headers: new Headers({
          "Accept-CH": "Viewport-Width",
          Vary: "Accept-Language",
        }),
      };
      applyDeviceHintResponseHeaders(response);

      expect(response.headers.get("Accept-CH")).toBe(
        "Viewport-Width, Sec-CH-UA-Mobile",
      );
      expect(response.headers.get("Vary")).toBe(
        "Accept-Language, User-Agent, Sec-CH-UA-Mobile",
      );
    });
  });
});
