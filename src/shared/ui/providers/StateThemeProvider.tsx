"use client";

import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import type { ThemeProviderProps } from "@mui/material/styles";
import React, { useContext, useMemo } from "react";

import { createCustomTheme, type SsrDeviceType } from "#/themes";

import { RuntimeDeviceHintContext } from "#/app/locale-app/RuntimeDeviceHintContext";

type StateThemeProviderProps = Omit<ThemeProviderProps, "theme"> & {
  ssrDeviceType?: SsrDeviceType;
};

export const StateThemeProvider: React.FC<StateThemeProviderProps> = ({
  children,
  ssrDeviceType: ssrDeviceTypeProp = "desktop",
  ...props
}) => {
  const runtimeDeviceHint = useContext(RuntimeDeviceHintContext);
  const ssrDeviceType = runtimeDeviceHint?.ssrDeviceType ?? ssrDeviceTypeProp;

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
