import { LocaleAppLayout } from "#/app/locale-app/LocaleAppLayout";

/** Locale marketing + app shell under `app/[lang]` (L1; Pages `i18n` still canonical for unprefixed `en` URLs). */
export const dynamic = "force-dynamic";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <LocaleAppLayout localeParam={lang}>{children}</LocaleAppLayout>;
}
