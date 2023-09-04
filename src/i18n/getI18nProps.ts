import { type GetStaticProps } from "next";

import type { Locales } from "#/i18n/i18n-types";
import { importLocaleAsync } from "#/i18n/i18n-util.async";
import { type TranslationDictionary } from "#/components/providers/I18nProvider";

export type I18nProps = {
  translations: TranslationDictionary;
}

export const getI18nProps: GetStaticProps<{
  i18n: I18nProps;
}> = async (context) => {
  const locale = (context.locale as Locales) || "en";
  const translations = { [locale]: await importLocaleAsync(locale) };

  return {
    props: {
      i18n: {
        translations,
      }
    }
  };
};
