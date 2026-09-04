import { generateLangStaticParams } from "#/app/locale-app/generateLangStaticParams";
import { LocaleAppLayout } from "#/app/locale-app/LocaleAppLayout";

/** Locale shell — cached i18n + synchronous SSR device hint; session client-fetched. */
export const instant = false;

export function generateStaticParams() {
  return generateLangStaticParams();
}

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
