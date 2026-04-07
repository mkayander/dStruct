import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import React, { useRef } from "react";

import {
  useLandingReveal,
  type UseLandingRevealOptions,
} from "#/features/homePage/ui/landing/useLandingReveal";

type LandingRevealProps = {
  children: React.ReactNode;
  /** Optional layout sx merged after reveal styles (e.g. margin). */
  sx?: SxProps<Theme>;
} & UseLandingRevealOptions;

/** Wraps block-level landing content for scroll-triggered entrance. */
export const LandingReveal: React.FC<LandingRevealProps> = ({
  children,
  sx,
  staggerMs = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { revealSx } = useLandingReveal(ref, { staggerMs });

  const mergedSx = (sx ? [revealSx, sx] : revealSx) as SxProps<Theme>;

  return (
    <Box ref={ref} sx={mergedSx}>
      {children}
    </Box>
  );
};
