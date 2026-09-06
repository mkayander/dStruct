import type { ReactNode } from "react";

import { MarketingLayoutClient } from "#/features/marketing/ui/MarketingLayoutClient";

/** Shared marketing shell (home, privacy) — instant navigations keep scroll + app bar. */
export default function LangMarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <MarketingLayoutClient>{children}</MarketingLayoutClient>;
}
