"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { useEffect, useState } from "react";

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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setIsDark(isDarkMode);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, colors }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ThemeContext.Provider>
  );
}
