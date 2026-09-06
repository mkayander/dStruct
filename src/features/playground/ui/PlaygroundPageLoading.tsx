"use client";

import React from "react";

import { PlaygroundPageShell } from "#/features/playground/ui/PlaygroundPageShell";
import { PlaygroundPanelsSkeleton } from "#/features/playground/ui/PlaygroundPanelsSkeleton";

/** Route-level instant-nav fallback — matches {@link PlaygroundPageView} chrome. */
export const PlaygroundPageLoading: React.FC = () => (
  <PlaygroundPageShell>
    <PlaygroundPanelsSkeleton />
  </PlaygroundPageShell>
);
