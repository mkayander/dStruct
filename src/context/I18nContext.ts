import { createContext } from "react";

import type { TranslationFunctions } from "#/i18n/i18n-types";

export type I18nContextType = {
  LL: {
    [key in keyof TranslationFunctions]: TranslationFunctions[key];
  };
};

export const fallbackProxy = new Proxy(
  {},
  {
    get: (target, key) => {
      if (key === "toString") return () => "FallbackProxy";

      return () => key;
    },
  }
) as I18nContextType["LL"];

export const I18nContext = createContext<I18nContextType>({
  LL: fallbackProxy,
});
