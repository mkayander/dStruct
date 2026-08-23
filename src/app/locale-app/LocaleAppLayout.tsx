import { notFound } from "next/navigation";
import { Suspense } from "react";

import type { Locales } from "#/i18n/i18n-types";
import { locales } from "#/i18n/i18n-util";
import { loadI18nForLocale } from "#/i18n/loadI18nForLocale";

import { LocaleAppLayoutRuntime } from "#/app/locale-app/LocaleAppLayoutRuntime";
import { LocaleAppLayoutShell } from "#/app/locale-app/LocaleAppLayoutShell";

/** Shared App Router locale layout for `app/[lang]` and `(default-locale)`. */
export async function LocaleAppLayout({
  children,
  localeParam,
}: {
  children: React.ReactNode;
  localeParam: string;
}) {
  if (!locales.includes(localeParam as Locales)) {
    notFound();
  }
  const locale = localeParam as Locales;
  const i18n = await loadI18nForLocale(locale);

  return (
    <Suspense
      fallback={
        <LocaleAppLayoutShell locale={locale} i18n={i18n}>
          {children}
        </LocaleAppLayoutShell>
      }
    >
      <LocaleAppLayoutRuntime locale={locale} i18n={i18n}>
        {children}
      </LocaleAppLayoutRuntime>
    </Suspense>
  );
}
