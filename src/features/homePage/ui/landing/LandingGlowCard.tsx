import {
  alpha,
  Box,
  Card,
  type SxProps,
  type Theme,
  useTheme,
} from "@mui/material";
import type { PointerEvent as ReactPointerEvent } from "react";
import React, { useCallback, useRef } from "react";

import { useLandingReveal } from "#/features/homePage/ui/landing/useLandingReveal";

/** Keeps `staggerIndex * step` distinct through demo row indices (e.g. 8–11). */
const LANDING_CARD_STAGGER_STEP_MS = 55;
const LANDING_CARD_STAGGER_MAX_MS = 11 * LANDING_CARD_STAGGER_STEP_MS;

export type LandingGlowCardProps = {
  children: React.ReactNode;
  /** Applied to the inner MUI `Card` (layout, padding, etc.). */
  cardSx?: SxProps<Theme>;
  /** Staggered entrance delay index; multiplied by 55ms. */
  staggerIndex?: number;
  /**
   * Demo / link tiles: hover lift, stronger shadow, inner ambient gradient,
   * and flex layout so `CardActionArea` fills the card height.
   */
  interactive?: boolean;
};

export const LandingGlowCard: React.FC<LandingGlowCardProps> = ({
  children,
  cardSx,
  staggerIndex = 0,
  interactive = false,
}) => {
  const theme = useTheme();
  const delayMs = Math.min(
    staggerIndex * LANDING_CARD_STAGGER_STEP_MS,
    LANDING_CARD_STAGGER_MAX_MS,
  );
  const revealRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { revealSx } = useLandingReveal(revealRef, { staggerMs: delayMs });

  const updateGlowPosition = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--landing-glow-x", `${x}%`);
      el.style.setProperty("--landing-glow-y", `${y}%`);
    },
    [],
  );

  const accent = theme.appDesign.accentSoft;
  const accentCore = theme.appDesign.accent;

  // Align glow wrapper with `MuiCard` theme override (cards use 8px, not `theme.shape.borderRadius`).
  const muiCardRoot = theme.components?.MuiCard?.styleOverrides?.root;
  const cardBorderRadius =
    muiCardRoot &&
    typeof muiCardRoot === "object" &&
    "borderRadius" in muiCardRoot &&
    (typeof muiCardRoot.borderRadius === "number" ||
      typeof muiCardRoot.borderRadius === "string")
      ? muiCardRoot.borderRadius
      : 8;

  return (
    <Box ref={revealRef} sx={[{ height: "100%" }, revealSx] as SxProps<Theme>}>
      <Box
        ref={rootRef}
        onPointerEnter={updateGlowPosition}
        onPointerMove={updateGlowPosition}
        className="landing-glow-card-root"
        sx={{
          position: "relative",
          height: "100%",
          borderRadius: cardBorderRadius,
          // Default spotlight for SSR / before first pointer move
          "--landing-glow-x": "50%",
          "--landing-glow-y": "42%",
          // Lift the whole stack (card + edge glow) so the ring stays aligned on hover.
          "@media (prefers-reduced-motion: no-preference)": {
            ...(interactive
              ? {
                  transition: "transform 0.22s ease",
                  "&:hover": { transform: "translateY(-3px)" },
                }
              : {}),
          },
        }}
      >
        <Card
          elevation={0}
          sx={{
            position: "relative",
            zIndex: 0,
            height: "100%",
            ...(interactive
              ? { display: "flex", flexDirection: "column" as const }
              : {}),
            borderRadius: cardBorderRadius,
            overflow: "hidden",
            border: `1px solid ${alpha(theme.appDesign.outline, 0.14)}`,
            bgcolor: alpha(theme.appDesign.surface, 0.62),
            backdropFilter: "blur(14px) saturate(160%)",
            boxShadow: `0 0 0 1px ${alpha(theme.appDesign.surfaceHigh, 0.06)} inset,
            0 18px 42px ${alpha(theme.appDesign.background, 0.35)}`,
            ...(!interactive
              ? { transition: "border-color 0.22s ease, box-shadow 0.22s ease" }
              : {
                  "@media (prefers-reduced-motion: no-preference)": {
                    transition:
                      "border-color 0.22s ease, box-shadow 0.22s ease",
                    ".landing-glow-card-root:hover &": {
                      borderColor: alpha(theme.appDesign.accentSoft, 0.32),
                      boxShadow: `0 0 0 1px ${alpha(theme.appDesign.accentSoft, 0.12)} inset,
                    0 22px 48px ${alpha(theme.appDesign.background, 0.42)}`,
                    },
                  },
                  "@media (prefers-reduced-motion: reduce)": {
                    ".landing-glow-card-root:hover &": {
                      borderColor: alpha(theme.appDesign.accentSoft, 0.28),
                    },
                  },
                }),
            ...cardSx,
          }}
        >
          {interactive ? (
            <>
              <Box
                aria-hidden
                className="landing-glow-card-ambient"
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  borderRadius: "inherit",
                  pointerEvents: "none",
                  opacity: 0,
                  transition: "opacity 0.4s ease",
                  background: `radial-gradient(
                  520px circle at var(--landing-glow-x) var(--landing-glow-y),
                  ${alpha(accent, 0.14)} 0%,
                  ${alpha(accentCore, 0.06)} 42%,
                  transparent 58%
                )`,
                  "@media (prefers-reduced-motion: reduce)": {
                    opacity: 0,
                    transition: "none",
                  },
                  "@media (prefers-reduced-motion: no-preference)": {
                    ".landing-glow-card-root:hover &": {
                      opacity: 1,
                    },
                  },
                }}
              />
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  flex: "1 1 auto",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                  height: "100%",
                  "& .MuiCardActionArea-root": {
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                  },
                }}
              >
                {children}
              </Box>
            </>
          ) : (
            children
          )}
        </Card>
        <Box
          aria-hidden
          className="landing-glow-card-ring"
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            borderRadius: "inherit",
            pointerEvents: "none",
            padding: "1px",
            opacity: 0,
            transition: "opacity 0.35s ease",
            background: `radial-gradient(
            420px circle at var(--landing-glow-x) var(--landing-glow-y),
            ${alpha(accent, 0.55)} 0%,
            ${alpha(accentCore, 0.22)} 38%,
            transparent 68%
          )`,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            "@media (prefers-reduced-motion: reduce)": {
              opacity: 0,
              transition: "none",
            },
            "@media (prefers-reduced-motion: no-preference)": {
              ".landing-glow-card-root:hover &": {
                opacity: 1,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};
