import { headers } from "next/headers";

import { APP_ROUTER_SSR_DEVICE_TYPE_HEADER } from "#/shared/lib/appRouterLocaleHeader";
import { parseSsrDeviceTypeHeader } from "#/shared/lib/ssrDevice";

import { LocaleAppRuntimeHintsClient } from "#/app/locale-app/LocaleAppRuntimeHintsClient";

/** Reads request-time device hint for playground/mobile SSR (streams via Suspense). */
export async function LocaleAppRuntimeHints() {
  const headerList = await headers();
  const ssrDeviceType = parseSsrDeviceTypeHeader(
    headerList.get(APP_ROUTER_SSR_DEVICE_TYPE_HEADER),
  );

  return <LocaleAppRuntimeHintsClient ssrDeviceType={ssrDeviceType} />;
}
