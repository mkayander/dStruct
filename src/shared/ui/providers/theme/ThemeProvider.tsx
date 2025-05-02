"use client";

import React, { createContext, useEffect, useMemo, useState } from "react";

import {
  darkColors,
  lightColors,
  THEME_STORAGE_KEY,
  type ThemeContextType,
  type ThemeMode,
} from "#/shared/lib/theme";

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
      if (saved) return saved;
    }
    return "light";
  });

  useEffect(() => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setMode(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  // Use pre-computed colors based on mode
  const colors = mode === "dark" ? darkColors : lightColors;

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
      setTheme,
      colors,
      isDark: mode === "dark",
      isLight: mode === "light",
    }),
    [colors, mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
