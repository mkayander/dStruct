"use client";

import { type Theme, useMediaQuery } from "@mui/material";

import { useHasMounted } from "#/shared/hooks/useHasMounted";

import { useRuntimeDeviceHint } from "#/app/locale-app/RuntimeDeviceHintContext";

/** Playground layout mode — SSR device hint until mount, then live breakpoint. */
export const usePlaygroundMobileLayout = (): boolean => {
  const { ssrDeviceType } = useRuntimeDeviceHint();
  const hasMounted = useHasMounted();
  const matchesMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
  );

  if (!hasMounted) {
    return ssrDeviceType === "mobile";
  }

  return matchesMobile;
};
