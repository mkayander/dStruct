"use client";

import type { ReactNode } from "react";

import type { I18nProps } from "#/i18n/getI18nProps";
import type { Locales } from "#/i18n/i18n-types";

import { AppRootLayoutClient } from "#/app/AppRootLayoutClient";

type LocaleAppLayoutShellProps = {
  children: ReactNode;
  locale: Locales;
  i18n: I18nProps;
};

/** Instant shell while session / device headers stream in (logged-out, desktop theme). */
export function LocaleAppLayoutShell({
  children,
  locale,
  i18n,
}: LocaleAppLayoutShellProps) {
  return (
    <AppRootLayoutClient session={null} i18n={i18n} locale={locale}>
      {children}
    </AppRootLayoutClient>
  );
}
