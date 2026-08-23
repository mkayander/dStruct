import type { IncomingHttpHeaders, ServerResponse } from "node:http";

import type { SsrDeviceType } from "#/themes";

const mobileUserAgentRegex =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

const readHeader = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const splitHeaderList = (value: string | number | string[] | undefined) => {
  if (!value) return [];

  const raw = Array.isArray(value) ? value.join(",") : String(value);

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const mergeHeaderList = (
  existingValue: string | number | string[] | undefined,
  valuesToAdd: string[],
) => {
  const merged = new Set(splitHeaderList(existingValue));
  for (const value of valuesToAdd) {
    merged.add(value);
  }

  return Array.from(merged).join(", ");
};

const parseClientHintMobile = (
  headers: IncomingHttpHeaders | Headers | undefined,
) => {
  if (!headers) return undefined;

  const headerValue =
    headers instanceof Headers
      ? (headers.get("sec-ch-ua-mobile") ?? undefined)
      : readHeader(headers["sec-ch-ua-mobile"]);

  if (!headerValue) return undefined;
  if (headerValue.includes("?1")) return true;
  if (headerValue.includes("?0")) return false;

  return undefined;
};

const parseUserAgentMobile = (
  headers: IncomingHttpHeaders | Headers | undefined,
) => {
  if (!headers) return undefined;

  const userAgent =
    headers instanceof Headers
      ? (headers.get("user-agent") ?? undefined)
      : readHeader(headers["user-agent"]);

  if (!userAgent) return undefined;
  return mobileUserAgentRegex.test(userAgent);
};

export const resolveSsrDeviceType = (
  headers: IncomingHttpHeaders | Headers | undefined,
): SsrDeviceType => {
  const clientHintMobile = parseClientHintMobile(headers);
  if (typeof clientHintMobile === "boolean") {
    return clientHintMobile ? "mobile" : "desktop";
  }

  const userAgentMobile = parseUserAgentMobile(headers);
  if (typeof userAgentMobile === "boolean") {
    return userAgentMobile ? "mobile" : "desktop";
  }

  return "desktop";
};

/** Parses proxy-set {@link APP_ROUTER_SSR_DEVICE_TYPE_HEADER} for playground SSR theme. */
export const parseSsrDeviceTypeHeader = (
  value: string | null,
): SsrDeviceType | undefined => {
  if (value === "mobile" || value === "desktop") {
    return value;
  }
  return undefined;
};

export const setDeviceHintResponseHeaders = (res?: ServerResponse) => {
  if (!res) return;

  res.setHeader(
    "Accept-CH",
    mergeHeaderList(res.getHeader("Accept-CH"), ["Sec-CH-UA-Mobile"]),
  );

  res.setHeader(
    "Vary",
    mergeHeaderList(res.getHeader("Vary"), ["User-Agent", "Sec-CH-UA-Mobile"]),
  );
};

/** Edge/proxy variant — merge device-hint response headers onto a NextResponse. */
export const applyDeviceHintResponseHeaders = (response: {
  headers: Headers;
}) => {
  response.headers.set(
    "Accept-CH",
    mergeHeaderList(response.headers.get("Accept-CH") ?? undefined, [
      "Sec-CH-UA-Mobile",
    ]),
  );
  response.headers.set(
    "Vary",
    mergeHeaderList(response.headers.get("Vary") ?? undefined, [
      "User-Agent",
      "Sec-CH-UA-Mobile",
    ]),
  );
};
