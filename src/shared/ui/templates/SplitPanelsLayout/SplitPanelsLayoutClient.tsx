"use client";

import dynamic from "next/dynamic";
import React from "react";

import { prefetchSplitPanelsLayout } from "#/shared/ui/templates/SplitPanelsLayout/prefetchSplitPanelsLayout";
import type { SplitPanelsLayoutProps } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayout";

const SplitPanelsLayout = dynamic(
  () =>
    prefetchSplitPanelsLayout().then((module) => ({
      default: module.SplitPanelsLayout,
    })),
  { ssr: false },
);

/** Client-only split layout — avoids Emotion hydration mismatch without a mount gate. */
export const SplitPanelsLayoutClient: React.FC<SplitPanelsLayoutProps> = (
  props,
) => <SplitPanelsLayout {...props} />;
