import { InteractiveDataProviders } from "#/app/locale-app/InteractiveDataProviders";

/** Apollo GraphQL for daily, playground, and profile (not marketing routes). */
export default function DefaultLocaleInteractiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InteractiveDataProviders>{children}</InteractiveDataProviders>;
}
