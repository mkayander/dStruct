import { headers } from "next/headers";

import { resolveSsrDeviceType } from "#/shared/lib/ssrDevice";

import { LocaleAppLayout } from "#/app/locale-app/LocaleAppLayout";

/** Playground layout reads request headers for SSR device hint (L5). */
export const instant = false;

/** Playground shell with SSR device hint for mobile layout (parity with Pages GSSP). */
export default async function LangPlaygroundLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const headerList = await headers();
  const ssrDeviceType = resolveSsrDeviceType(headerList);

  return (
    <LocaleAppLayout localeParam={lang} ssrDeviceType={ssrDeviceType}>
      {children}
    </LocaleAppLayout>
  );
}
