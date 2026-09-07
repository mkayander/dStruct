import type { ReactNode } from "react";

import { AppChromeLayoutClient } from "#/features/appChrome/ui/AppChromeLayoutClient";

/** Persistent chrome for profile — Apollo prefetch stays in {@link ProfilePage}. */
export default function DefaultLocaleProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppChromeLayoutClient>{children}</AppChromeLayoutClient>;
}
