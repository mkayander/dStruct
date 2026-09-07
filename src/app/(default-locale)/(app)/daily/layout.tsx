import type { ReactNode } from "react";

import { AppChromeLayoutClient } from "#/features/appChrome/ui/AppChromeLayoutClient";

/** Persistent chrome for daily — Apollo prefetch stays in {@link DailyPage}. */
export default function DefaultLocaleDailyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppChromeLayoutClient>{children}</AppChromeLayoutClient>;
}
