import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Shared glass/backdrop overlay styles for floating panels.
 * Use for consistent frosted-glass appearance across the app.
 */
export const glassOverlaySx = (theme: Theme): SxProps<Theme> => {
  const isDark = theme.palette.mode === "dark";
  return {
    background: alpha(theme.palette.background.paper, isDark ? 0.25 : 0.55),
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: `1px solid ${alpha(
      theme.palette.common.white,
      isDark ? 0.08 : 0.35,
    )}`,
    boxShadow: `0 8px 32px ${alpha(
      theme.palette.common.black,
      isDark ? 0.4 : 0.08,
    )}`,
  };
};
