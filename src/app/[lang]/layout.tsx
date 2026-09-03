import { LocaleAppLayout } from "#/app/locale-app/LocaleAppLayout";

/** Locale shell — cached i18n only; session/device stream via Suspense (L5). */
export const instant = false;

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
