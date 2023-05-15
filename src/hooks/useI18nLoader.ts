import { useRouter } from "next/router";
import { useEffect } from "react";

import { useI18nContext } from "#/i18n/i18n-react";
import type { Locales } from "#/i18n/i18n-types";
import { loadLocaleAsync } from "#/i18n/i18n-util.async";

export const useI18nLoader = () => {
  const router = useRouter();
  const { setLocale } = useI18nContext();

  useEffect(() => {
    (async () => {
      const locale = (router.locale as Locales) || "en";
      await loadLocaleAsync(locale);
      setLocale(locale);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale]);
};
