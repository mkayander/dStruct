"use client";

import React, { type ReactNode, useEffect } from "react";

import { useClientCanonicalPlaygroundRedirect } from "#/features/playground/hooks/useClientCanonicalPlaygroundRedirect";
import { usePlaygroundPyodideWarmup } from "#/features/playground/hooks/usePlaygroundPyodideWarmup";
import { usePlaygroundRuntimeRelease } from "#/features/playground/hooks/usePlaygroundRuntimeRelease";
import { usePlaygroundSlugLoadingSync } from "#/features/playground/hooks/usePlaygroundSlugLoadingSync";
import { PlaygroundPageShell } from "#/features/playground/ui/PlaygroundPageShell";
import { ProjectBrowserProvider } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { prefetchSplitPanelsLayout } from "#/shared/ui/templates/SplitPanelsLayout/prefetchSplitPanelsLayout";

import { ProjectBrowserOverlay } from "#/app/locale-app/ProjectBrowserOverlay";

type PlaygroundLayoutClientProps = {
  children: ReactNode;
};

const PlaygroundRouteEffects: React.FC = () => {
  usePlaygroundRuntimeRelease();
  usePlaygroundPyodideWarmup();
  useClientCanonicalPlaygroundRedirect();
  usePlaygroundSlugLoadingSync();

  useEffect(() => {
    void prefetchSplitPanelsLayout();
  }, []);

  return null;
};

/**
 * Persistent playground segment chrome — survives loading.tsx → page swaps
 * so instant navigations do not remount the header or restart Pyodide.
 */
export const PlaygroundLayoutClient: React.FC<PlaygroundLayoutClientProps> = ({
  children,
}) => {
  return (
    <ProjectBrowserProvider>
      <PlaygroundRouteEffects />
      <PlaygroundPageShell>{children}</PlaygroundPageShell>
      <ProjectBrowserOverlay />
    </ProjectBrowserProvider>
  );
};
