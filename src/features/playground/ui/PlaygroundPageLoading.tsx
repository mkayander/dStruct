"use client";

import React from "react";

import { PlaygroundPanelsSkeleton } from "#/features/playground/ui/PlaygroundPanelsSkeleton";

/** Route-level instant-nav fallback — panel area only; shell lives in playground layout. */
export const PlaygroundPageLoading: React.FC = () => (
  <PlaygroundPanelsSkeleton />
);
