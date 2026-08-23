import { LocaleAppLayout } from "#/app/locale-app/LocaleAppLayout";

/** Locale layouts use session/i18n loaders — opt out until cached (L5). */
export const instant = false;

/** Locale marketing shell under `app/[lang]/(marketing)`. */
export default async function LangMarketingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <LocaleAppLayout localeParam={lang}>{children}</LocaleAppLayout>;
}
