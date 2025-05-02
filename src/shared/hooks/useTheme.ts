import { useContext } from "react";

import { ThemeContext } from "../ui/providers/theme/ThemeProvider";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useIsDarkMode = () => {
  const { isDark } = useTheme();
  return isDark;
};

export const useThemeColors = () => {
  const { colors } = useTheme();
  return colors;
};
