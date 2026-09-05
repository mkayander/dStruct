import type { ReactNode } from "react";

import { ProjectBrowserOverlay } from "#/app/locale-app/ProjectBrowserOverlay";

/** Page tree + global overlays that require SessionProvider (inside SessionGate). */
export const LocaleAppPageShell = ({ children }: { children: ReactNode }) => (
  <>
    {children}
    <ProjectBrowserOverlay />
  </>
);
