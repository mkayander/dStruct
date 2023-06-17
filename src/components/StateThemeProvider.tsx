"use client";

import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import type { ThemeProviderProps } from "@mui/material/styles/ThemeProvider";
import React, { useMemo } from "react";

import { useAppSelector } from "#/store/hooks";
import { selectIsLightMode } from "#/store/reducers/appBarReducer";
import { themes } from "#/themes";

export const StateThemeProvider: React.FC<Omit<ThemeProviderProps, "theme">> = (
  props
) => {
  const isLightMode = useAppSelector(selectIsLightMode);

  const theme = useMemo(
    () => (isLightMode ? themes.light : themes.dark),
    [isLightMode]
  );

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme} {...props} />
    </>
  );
};
