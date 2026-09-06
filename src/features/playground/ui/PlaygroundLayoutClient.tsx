"use client";

import React, { type ReactNode, useEffect } from "react";

import { usePlaygroundPyodideWarmup } from "#/features/playground/hooks/usePlaygroundPyodideWarmup";
import { usePlaygroundRuntimeRelease } from "#/features/playground/hooks/usePlaygroundRuntimeRelease";
import { usePlaygroundSlugLoadingSync } from "#/features/playground/hooks/usePlaygroundSlugLoadingSync";
import { PlaygroundPageShell } from "#/features/playground/ui/PlaygroundPageShell";
import { prefetchSplitPanelsLayout } from "#/shared/ui/templates/SplitPanelsLayout/prefetchSplitPanelsLayout";

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
  usePlaygroundSlugLoadingSync();

  // Prefetch split layout chunk while route loading skeleton is visible.
  useEffect(() => {
    void prefetchSplitPanelsLayout();
  }, []);

  return <PlaygroundPageShell>{children}</PlaygroundPageShell>;
};
