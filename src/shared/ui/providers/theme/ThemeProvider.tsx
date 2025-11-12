"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { useMemo } from "react";

import { colors } from "#/shared/lib/colors";

export const ThemeContext = React.createContext<{
  isDark: boolean;
  colors: Record<string, any>;
}>({
  isDark: false,
  colors,
});

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const isDark = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    return false;
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, colors }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ThemeContext.Provider>
  );
}
