"use client";

import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import type { ThemeProviderProps } from "@mui/material/styles/ThemeProvider";
import React from "react";

import { theme } from "#/themes";

export const StateThemeProvider: React.FC<
  Omit<ThemeProviderProps, "theme">
> = ({ children, ...props }) => {
  return (
    <ThemeProvider theme={theme} {...props}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
