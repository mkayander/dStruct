import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Shared sx styles for IconButtons with secondary color and primary-tinted hover.
 * Use for consistent icon button styling across the app.
 */
export const iconButtonHoverSx = (theme: Theme): SxProps<Theme> => ({
  color: "text.secondary",
  "&:hover:not(:disabled)": {
    background: alpha(theme.palette.primary.main, 0.12),
    color: "primary.main",
  },
});
