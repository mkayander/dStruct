import type { ReactNode } from "react";

/** Page tree inside SessionGate (playground overlays live in playground layout). */
export const LocaleAppPageShell = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);
