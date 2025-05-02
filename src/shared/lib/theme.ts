import { getThemeColors } from "./colors";

export type ThemeMode = "light" | "dark";

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  colors: ReturnType<typeof getThemeColors>;
  isDark: boolean;
  isLight: boolean;
}

export const THEME_STORAGE_KEY = "theme-mode";

// Pre-compute both theme variants
export const lightColors = getThemeColors(false);
export const darkColors = getThemeColors(true);
