import { headers } from "next/headers";

import { baseLocale } from "#/i18n/i18n-util";
import { resolveSsrDeviceType } from "#/shared/lib/ssrDevice";

import { LocaleAppLayout } from "#/app/locale-app/LocaleAppLayout";

/** Playground layout reads request headers for SSR device hint (L5). */
export const instant = false;

/** Playground shell with SSR device hint for mobile layout (parity with Pages GSSP). */
export default async function DefaultLocalePlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const ssrDeviceType = resolveSsrDeviceType(headerList);

  return (
    <LocaleAppLayout localeParam={baseLocale} ssrDeviceType={ssrDeviceType}>
      {children}
    </LocaleAppLayout>
  );
}
