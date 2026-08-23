import { getServerSession } from "next-auth";
import { headers } from "next/headers";

import type { I18nProps } from "#/i18n/getI18nProps";
import type { Locales } from "#/i18n/i18n-types";
import { authOptions } from "#/server/auth/authOptions";
import { APP_ROUTER_SSR_DEVICE_TYPE_HEADER } from "#/shared/lib/appRouterLocaleHeader";
import { parseSsrDeviceTypeHeader } from "#/shared/lib/ssrDevice";

import { AppRootLayoutClient } from "#/app/AppRootLayoutClient";

type LocaleAppLayoutRuntimeProps = {
  children: React.ReactNode;
  locale: Locales;
  i18n: I18nProps;
};

/** Session + playground device hints — runtime APIs wrapped in Suspense (L5). */
export async function LocaleAppLayoutRuntime({
  children,
  locale,
  i18n,
}: LocaleAppLayoutRuntimeProps) {
  const session = await getServerSession(authOptions);
  const headerList = await headers();
  const ssrDeviceType = parseSsrDeviceTypeHeader(
    headerList.get(APP_ROUTER_SSR_DEVICE_TYPE_HEADER),
  );

  return (
    <AppRootLayoutClient
      session={session}
      i18n={i18n}
      locale={locale}
      ssrDeviceType={ssrDeviceType}
    >
      {children}
    </AppRootLayoutClient>
  );
}
