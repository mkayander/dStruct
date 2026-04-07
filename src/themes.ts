"use client";

import type { PaletteColor } from "@mui/material";
import { alpha, createTheme } from "@mui/material/styles";

import type { Difficulty } from "#/graphql/generated";

export type SsrDeviceType = "mobile" | "desktop";

const obsidianTokens = {
  /** App shell canvas (body / CssBaseline); landing sections can use `background` for lifted tones. */
  canvas: "#121212",
  background: "#101417",
  surfaceLow: "#181c1f",
  surface: "#1c2023",
  surfaceHigh: "#262a2d",
  surfaceHighest: "#2f3438",
  surfaceLowest: "#0b0f11",
  outline: "#444749",
  accent: "#026be0",
  accentSoft: "#adc7ff",
  accentLight: "#88aef7",
  accentDark: "#4d8fff",
  accentGlow: "#d9e7ff",
  textPrimary: "#f5f7fa",
  textSecondary: "#a6b0ba",
  textMuted: "#88929b",
  success: "#63d2a1",
  warning: "#e0b267",
  error: "#ee7d77",
} as const;

const getViewportWidth = (deviceType: SsrDeviceType) =>
  deviceType === "mobile" ? 375 : 1024;

const parseCssPx = (value: string | undefined) => {
  if (!value) return undefined;

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const queryMatchesViewport = (query: string, viewportWidth: number) => {
  const minMatches = Array.from(
    query.matchAll(/\(min-width:\s*([0-9.]+)px\)/gi),
  )
    .map((match) => parseCssPx(match[1]))
    .filter((value): value is number => typeof value === "number");
  const maxMatches = Array.from(
    query.matchAll(/\(max-width:\s*([0-9.]+)px\)/gi),
  )
    .map((match) => parseCssPx(match[1]))
    .filter((value): value is number => typeof value === "number");

  if (minMatches.length === 0 && maxMatches.length === 0) {
    // Keep SSR behavior conservative for unsupported query types.
    return false;
  }

  if (minMatches.some((minWidth) => viewportWidth < minWidth)) return false;
  if (maxMatches.some((maxWidth) => viewportWidth > maxWidth)) return false;

  return true;
};

const createSsrMatchMedia = (deviceType: SsrDeviceType) => (query: string) => ({
  matches: queryMatchesViewport(query, getViewportWidth(deviceType)),
});

/** MUI dark mode uses a #266798 autofill inset; transparent avoids the blue wash with any surface. */
const webkitAutofillTransparent = {
  WebkitBoxShadow: "0 0 0 100px transparent inset",
  WebkitTextFillColor: obsidianTokens.textPrimary,
  caretColor: obsidianTokens.textPrimary,
} as const;

export const createCustomTheme = (deviceType: SsrDeviceType = "desktop") => {
  const theme = createTheme({
    cssVariables: true,
    palette: {
      mode: "dark",
      primary: {
        main: "#ffffff",
        light: "#f5f7fa",
        dark: "#c5c6c8",
        contrastText: obsidianTokens.background,
      },
      secondary: {
        main: obsidianTokens.accentSoft,
        light: obsidianTokens.accentGlow,
        dark: "#88aef7",
        contrastText: obsidianTokens.background,
      },
      info: {
        main: obsidianTokens.accent,
      },
      success: {
        main: obsidianTokens.success,
      },
      warning: {
        main: obsidianTokens.warning,
      },
      error: {
        main: obsidianTokens.error,
      },
      background: {
        default: obsidianTokens.canvas,
        paper: obsidianTokens.surfaceLow,
      },
      text: {
        primary: obsidianTokens.textPrimary,
        secondary: obsidianTokens.textSecondary,
      },
      divider: alpha(obsidianTokens.outline, 0.18),
      action: {
        hover: alpha(obsidianTokens.accentSoft, 0.08),
        selected: alpha(obsidianTokens.accentSoft, 0.12),
        focus: alpha(obsidianTokens.accentSoft, 0.18),
      },
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
        letterSpacing: "-0.04em",
        lineHeight: 1.04,
      },
      h2: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
        letterSpacing: "-0.04em",
        lineHeight: 1.08,
      },
      h3: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
        letterSpacing: "-0.035em",
      },
      h4: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 700,
        letterSpacing: "-0.03em",
      },
      h5: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h6: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      subtitle2: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      },
      button: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
        textTransform: "none",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: obsidianTokens.background,
            color: obsidianTokens.textPrimary,
          },
          "::selection": {
            backgroundColor: alpha(obsidianTokens.accentSoft, 0.26),
          },
        },
      },
      MuiUseMediaQuery: {
        defaultProps: {
          ssrMatchMedia: createSsrMatchMedia(deviceType),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: obsidianTokens.surface,
            backgroundImage: "none",
            borderRadius: 8,
            border: `1px solid ${alpha(obsidianTokens.outline, 0.14)}`,
            boxShadow: "none",
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            backgroundColor: obsidianTokens.surface,
            backgroundImage: "none",
            borderRadius: "8px !important",
            boxShadow: "none",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            minHeight: 40,
            borderRadius: 4,
            paddingInline: 16,
          },
          containedPrimary: {
            background: "linear-gradient(180deg, #ffffff 0%, #c5c6c8 100%)",
            color: obsidianTokens.background,
            "&:hover": {
              background: "linear-gradient(180deg, #ffffff 0%, #d9dadc 100%)",
            },
          },
          outlined: {
            borderColor: alpha(obsidianTokens.outline, 0.36),
            backgroundColor: alpha(obsidianTokens.surfaceHigh, 0.55),
            "&:hover": {
              borderColor: alpha(obsidianTokens.accentSoft, 0.45),
              backgroundColor: alpha(obsidianTokens.surfaceHigh, 0.82),
            },
          },
          text: {
            "&:hover": {
              backgroundColor: alpha(obsidianTokens.accentSoft, 0.08),
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            // MUI sets backgroundColor: transparent under &:hover + @media (hover: none) for touch
            // devices, which makes sticky :hover after a tap wipe out any custom resting bgcolor.
            // Keep the same hover tint as fine pointers so behavior matches across form factors.
            "&:hover": {
              "@media (hover: none)": {
                backgroundColor: "var(--IconButton-hoverBg)",
              },
            },
            "&.Mui-focusVisible": {
              backgroundColor: theme.palette.action.focus,
            },
            "&:active": {
              backgroundColor: theme.palette.action.selected,
            },
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            backgroundColor: alpha(obsidianTokens.accent, 0.12),
            color: obsidianTokens.accentSoft,
            border: `1px solid ${alpha(obsidianTokens.accentSoft, 0.12)}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: alpha(obsidianTokens.surfaceHigh, 0.88),
            backdropFilter: "blur(20px)",
            borderColor: alpha(obsidianTokens.outline, 0.18),
            backgroundImage: "none",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: alpha(obsidianTokens.surfaceHigh, 0.94),
            backdropFilter: "blur(18px)",
            border: `1px solid ${alpha(obsidianTokens.outline, 0.16)}`,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: alpha(obsidianTokens.surfaceHigh, 0.96),
            border: `1px solid ${alpha(obsidianTokens.outline, 0.16)}`,
            color: obsidianTokens.textPrimary,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: "transparent",
            "& fieldset": {
              borderColor: alpha(obsidianTokens.outline, 0.14),
            },
            "&:hover fieldset": {
              borderColor: alpha(obsidianTokens.accentSoft, 0.24),
            },
            "&.Mui-focused fieldset": {
              borderColor: alpha(obsidianTokens.accentSoft, 0.7),
            },
          },
          input: {
            "&:-webkit-autofill": {
              ...webkitAutofillTransparent,
              borderRadius: "inherit",
            },
          },
        },
      },
      MuiFilledInput: {
        styleOverrides: {
          root: {
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "transparent",
              "@media (hover: none)": {
                backgroundColor: "transparent",
              },
            },
            "&.Mui-focused": {
              backgroundColor: "transparent",
            },
            "&.Mui-disabled": {
              backgroundColor: "transparent",
            },
          },
          input: {
            "&:-webkit-autofill": {
              ...webkitAutofillTransparent,
              borderTopLeftRadius: "inherit",
              borderTopRightRadius: "inherit",
            },
          },
        },
      },
    },
  });

  theme.appDesign = {
    background: obsidianTokens.background,
    canvas: obsidianTokens.canvas,
    surfaceLow: obsidianTokens.surfaceLow,
    surface: obsidianTokens.surface,
    surfaceHigh: obsidianTokens.surfaceHigh,
    surfaceHighest: obsidianTokens.surfaceHighest,
    surfaceLowest: obsidianTokens.surfaceLowest,
    outline: obsidianTokens.outline,
    accent: obsidianTokens.accent,
    accentSoft: obsidianTokens.accentSoft,
    accentLight: obsidianTokens.accentLight,
    accentDark: obsidianTokens.accentDark,
    textMuted: obsidianTokens.textMuted,
  };

  const tagColors: Record<string, [string, string]> = {
    "two-pointers": ["#69a3ff", "#026be0"],
    "union-find": ["#87b0ff", "#2d6de7"],
    string: ["#ba93ff", "#7a7dff"],
    queue: ["#53d3c2", "#2f8b8f"],
    design: ["#adc7ff", "#026be0"],
    array: ["#4d8fff", "#026be0"],
    "dynamic-programming": ["#7bc2ff", "#1c77d8"],
    graph: ["#adc7ff", "#6a8ef6"],
    "linked-list": ["#f0b37a", "#8ca8ff"],
    heap: ["#f29ad8", "#8d7bff"],
  };

  theme.palette.question = {
    All: theme.palette.augmentColor({
      name: "All",
      color: {
        main: theme.palette.primary.light,
      },
    }),
    Easy: theme.palette.augmentColor({
      name: "Easy",
      color: {
        main: "#55d5c2",
      },
    }),
    Medium: theme.palette.augmentColor({
      name: "Medium",
      color: {
        // main: '#ffc52f',
        main: theme.palette.warning.main,
      },
    }),
    Hard: theme.palette.augmentColor({
      name: "Hard",
      color: {
        // main: '#ff4066',
        main: theme.palette.error.main,
      },
    }),

    getTagColors(slug?: string): [string, string] {
      if (slug && slug in tagColors) {
        return tagColors[slug] as [string, string];
      }

      const colors = Object.values(tagColors);
      const randomIndex = Math.floor(Math.random() * colors.length);

      return colors[randomIndex] as [string, string];
    },
  };

  return theme;
};

declare module "@mui/material/styles" {
  interface Palette {
    question: Record<Difficulty, PaletteColor> & {
      getTagColors(slug?: string): [string, string];
    };
  }

  interface Theme {
    appDesign: {
      canvas: string;
      background: string;
      surfaceLow: string;
      surface: string;
      surfaceHigh: string;
      surfaceHighest: string;
      surfaceLowest: string;
      outline: string;
      accent: string;
      accentLight: string;
      accentDark: string;
      accentSoft: string;
      textMuted: string;
    };
  }

  interface ThemeOptions {
    appDesign?: Partial<Theme["appDesign"]>;
  }
}

export const theme = createCustomTheme();
