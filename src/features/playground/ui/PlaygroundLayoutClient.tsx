"use client";

import React, { type ReactNode, useEffect } from "react";

import { usePlaygroundPyodideWarmup } from "#/features/playground/hooks/usePlaygroundPyodideWarmup";
import { usePlaygroundRuntimeRelease } from "#/features/playground/hooks/usePlaygroundRuntimeRelease";
import { PlaygroundPageShell } from "#/features/playground/ui/PlaygroundPageShell";

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

  // Prefetch split layout chunk while route loading skeleton is visible.
  useEffect(() => {
    void import("#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayout");
  }, []);

  return <PlaygroundPageShell>{children}</PlaygroundPageShell>;
};
