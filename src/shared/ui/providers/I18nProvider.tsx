import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { i18nObject } from "typesafe-i18n";

import {
  fallbackProxy,
  I18nContext,
  type I18nContextType,
} from "#/context/I18nContext";
import { initFormatters } from "#/i18n/formatters";
import { type I18nProps } from "#/i18n/getI18nProps";
import type { Formatters, Locales, Translation } from "#/i18n/i18n-types";
import { importLocaleAsync } from "#/i18n/i18n-util.async";

export type TranslationDictionary = Partial<Record<Locales, Translation>>;
export type FormattersDictionary = Partial<Record<Locales, Formatters>>;

type I18nProviderCoreProps = React.PropsWithChildren<{
  locale: Locales;
  i18n?: I18nProps;
}>;

/**
 * Locale + dictionary state shared by Pages and App Router shells.
 * Do not use under App Router with `next/router` — use {@link AppRouterI18nProvider}.
 */
const I18nProviderCore: React.FC<I18nProviderCoreProps> = ({
  locale,
  i18n: initialI18n,
  children,
}) => {
  const [translations, setTranslations] = useState<TranslationDictionary>(
    initialI18n?.translations ?? {},
  );
  const [formatters, setFormatters] = useState<FormattersDictionary>({
    [locale]: initFormatters(locale),
  });

  useEffect(() => {
    if (!(locale in translations)) {
      (async () => {
        const newTranslation = await importLocaleAsync(locale);

        setTranslations((prev) => ({
          ...prev,
          [locale]: newTranslation,
        }));
      })();
    }

    if (!(locale in formatters)) {
      setFormatters((prev) => ({
        ...prev,
        [locale]: initFormatters(locale),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const ctx = useMemo<I18nContextType>(
    () => ({
      locale,
      LL: !locale
        ? fallbackProxy
        : i18nObject(
            locale,
            translations[locale] ?? {},
            formatters[locale] ?? {},
          ),
    }),
    [locale, translations, formatters],
  );

  return <I18nContext.Provider value={ctx}>{children}</I18nContext.Provider>;
};

type I18nProviderProps = React.PropsWithChildren<{
  i18n?: I18nProps;
}>;

/** Pages Router: locale from `next/router` (Next.js `i18n` config). */
export const I18nProvider: React.FC<I18nProviderProps> = ({
  i18n,
  children,
}) => {
  const router = useRouter();
  const locale = (router.locale as Locales) || "en";
  return (
    <I18nProviderCore locale={locale} i18n={i18n}>
      {children}
    </I18nProviderCore>
  );
};

type AppRouterI18nProviderProps = React.PropsWithChildren<{
  locale: Locales;
  i18n?: I18nProps;
}>;

/** App Router: fixed locale (no `next/router`). */
export const AppRouterI18nProvider: React.FC<AppRouterI18nProviderProps> = ({
  locale,
  i18n,
  children,
}) => (
  <I18nProviderCore locale={locale} i18n={i18n}>
    {children}
  </I18nProviderCore>
);
