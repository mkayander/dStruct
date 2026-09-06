"use client";

import React, { type ReactNode, useEffect } from "react";

import { useClientCanonicalPlaygroundRedirect } from "#/features/playground/hooks/useClientCanonicalPlaygroundRedirect";
import { usePlaygroundPyodideWarmup } from "#/features/playground/hooks/usePlaygroundPyodideWarmup";
import { usePlaygroundRuntimeRelease } from "#/features/playground/hooks/usePlaygroundRuntimeRelease";
import { usePlaygroundSlugLoadingSync } from "#/features/playground/hooks/usePlaygroundSlugLoadingSync";
import { PlaygroundPageShell } from "#/features/playground/ui/PlaygroundPageShell";
import { ProjectBrowserProvider } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContext";
import { prefetchSplitPanelsLayout } from "#/shared/ui/templates/SplitPanelsLayout/prefetchSplitPanelsLayout";

import { ApolloHydrationProvider } from "#/app/locale-app/ApolloHydrationProvider";
import { ProjectBrowserOverlay } from "#/app/locale-app/ProjectBrowserOverlay";

type PlaygroundLayoutClientProps = {
  children: ReactNode;
};

/**
 * Persistent playground segment chrome — survives loading.tsx → page swaps
 * so instant navigations do not remount the header or restart Pyodide.
 */
export const PlaygroundLayoutClient: React.FC<PlaygroundLayoutClientProps> = ({
  children,
}) => {
  usePlaygroundRuntimeRelease();
  usePlaygroundPyodideWarmup();
  useClientCanonicalPlaygroundRedirect();
  usePlaygroundSlugLoadingSync();

  // Prefetch split layout chunk while route loading skeleton is visible.
  useEffect(() => {
    void prefetchSplitPanelsLayout();
  }, []);

  return (
    <ApolloHydrationProvider initialCache={null}>
      <ProjectBrowserProvider>
        <PlaygroundPageShell>{children}</PlaygroundPageShell>
        <ProjectBrowserOverlay />
      </ProjectBrowserProvider>
    </ApolloHydrationProvider>
  );
};
