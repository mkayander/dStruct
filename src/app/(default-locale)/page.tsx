import type { Metadata } from "next";

import { MarketingHomeView } from "#/features/homePage/ui/MarketingHomeView";
import { baseLocale } from "#/i18n/i18n-util";

import { publicPageMetadataFromTranslation } from "#/app/locale-app/publicPageMetadataFromTranslation";

/** Marketing home — instant client navigations to sibling routes (L5). */
export const instant = true;

export async function generateMetadata(): Promise<Metadata> {
  return publicPageMetadataFromTranslation(baseLocale, "/", (translation) => ({
    title: translation.SITE_SEO_TITLE,
    description: translation.SITE_SEO_DESCRIPTION,
  }));
}

/** App Router home at `/` (default locale; non-`en` locales use `app/[lang]`). */
export default function DefaultLocaleHomePage() {
  return <MarketingHomeView />;
}
