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

type I18nProviderProps = React.PropsWithChildren<{
  i18n?: I18nProps;
}>;

export const I18nProvider: React.FC<I18nProviderProps> = (props) => {
  const router = useRouter();
  const locale = (router.locale as Locales) || "en";

  const [translations, setTranslations] = useState<TranslationDictionary>(
    props.i18n?.translations ?? {},
  );
  const formatters = useMemo(
    () => ({ [locale]: initFormatters(locale) }),
    [locale],
  );

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

  return (
    <I18nContext.Provider value={ctx}>{props.children}</I18nContext.Provider>
  );
};
