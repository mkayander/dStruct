import { loadPublicProjectSeoFields } from "#/features/playground/lib/loadPublicProjectSeoFields";
import { createTranslationFunctions } from "#/i18n/createTranslationFunctions";
import type { Locales } from "#/i18n/i18n-types";
import { loadI18nForLocale } from "#/i18n/loadI18nForLocale";

export type PlaygroundPageSeo = {
  pageTitle: string;
  pageDescription: string;
};

/** Shared playground `<title>` / meta description for Pages gSSP and App metadata. */
export async function resolvePlaygroundPageSeo(
  locale: Locales,
  slugStr?: string,
): Promise<PlaygroundPageSeo> {
  const { translations } = await loadI18nForLocale(locale);
  const translation = translations[locale];
  if (!translation) {
    throw new Error(`Missing translations for locale: ${locale}`);
  }
  const LL = createTranslationFunctions(locale, translation);

  let pageTitle: string = LL.PLAYGROUND_SEO_TITLE();
  let pageDescription: string = LL.SITE_SEO_DESCRIPTION();

  if (slugStr) {
    const project = await loadPublicProjectSeoFields(slugStr);
    if (project) {
      pageTitle = `${project.title} | dStruct`;
      pageDescription = project.description?.trim()
        ? `${project.title}: ${project.description.trim()}`
        : LL.PLAYGROUND_PROJECT_SEO_DESCRIPTION({ title: project.title });
    }
  }

  return { pageTitle, pageDescription };
}
