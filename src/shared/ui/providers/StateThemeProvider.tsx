"use client";

import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import type { ThemeProviderProps } from "@mui/material/styles";
import React, { useMemo } from "react";

import { createCustomTheme, type SsrDeviceType } from "#/themes";

type StateThemeProviderProps = Omit<ThemeProviderProps, "theme"> & {
  ssrDeviceType?: SsrDeviceType;
};

export const StateThemeProvider: React.FC<StateThemeProviderProps> = ({
  children,
  ssrDeviceType = "desktop",
  ...props
}) => {
  const theme = useMemo(
    () => createCustomTheme(ssrDeviceType),
    [ssrDeviceType],
  );

  return (
    <ThemeProvider theme={theme} {...props}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
