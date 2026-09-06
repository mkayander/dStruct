"use client";

import dynamic from "next/dynamic";
import React from "react";

import type { SplitPanelsLayoutProps } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayout";
import { SplitPanelsLayoutSkeleton } from "#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayoutSkeleton";

const SplitPanelsLayout = dynamic(
  () =>
    import("#/shared/ui/templates/SplitPanelsLayout/SplitPanelsLayout").then(
      (module) => ({ default: module.SplitPanelsLayout }),
    ),
  {
    ssr: false,
    loading: () => <SplitPanelsLayoutSkeleton />,
  },
);

/** Client-only split layout — avoids Emotion hydration mismatch without a mount gate. */
export const SplitPanelsLayoutClient: React.FC<SplitPanelsLayoutProps> = (
  props,
) => <SplitPanelsLayout {...props} />;
