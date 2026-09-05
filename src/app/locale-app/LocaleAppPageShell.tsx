"use client";

import React, { type ReactNode } from "react";

import { ProjectBrowser } from "#/features/project/ui/ProjectBrowser/ProjectBrowser";

/** Page tree + global overlays that require SessionProvider (inside SessionGate). */
export const LocaleAppPageShell: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <>
    {children}
    <ProjectBrowser />
  </>
);
