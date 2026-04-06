import {
  alpha,
  Box,
  Card,
  keyframes,
  useTheme,
  type SxProps,
  type Theme,
} from "@mui/material";
import type { PointerEvent as ReactPointerEvent } from "react";
import React, { useCallback, useRef } from "react";

const landingCardEnter = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 14px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

export type LandingGlowCardProps = {
  children: React.ReactNode;
  /** Applied to the inner MUI `Card` (layout, padding, etc.). */
  cardSx?: SxProps<Theme>;
  /** Staggered entrance delay index; multiplied by 55ms. */
  staggerIndex?: number;
  /** Slight lift and shadow on hover (e.g. demo link tiles). */
  interactive?: boolean;
};

export const LandingGlowCard: React.FC<LandingGlowCardProps> = ({
  children,
  cardSx,
  staggerIndex = 0,
  interactive = false,
}) => {
  const theme = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);

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
  const delayMs = Math.min(staggerIndex * 55, 480);

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
        ...(interactive
          ? {
              transition: "transform 0.22s ease",
              "&:hover": { transform: "translateY(-3px)" },
            }
          : {}),
        "@media (prefers-reduced-motion: no-preference)": {
          animation: `${landingCardEnter} 0.62s cubic-bezier(0.22, 1, 0.36, 1) both`,
          animationDelay: `${delayMs}ms`,
        },
      }}
    >
      <Card
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 0,
          height: "100%",
          borderRadius: cardBorderRadius,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.appDesign.outline, 0.14)}`,
          bgcolor: alpha(theme.appDesign.surface, 0.62),
          backdropFilter: "blur(14px) saturate(160%)",
          boxShadow: `0 0 0 1px ${alpha(theme.appDesign.surfaceHigh, 0.06)} inset,
            0 18px 42px ${alpha(theme.appDesign.background, 0.35)}`,
          transition: "border-color 0.22s ease, box-shadow 0.22s ease",
          ...(interactive
            ? {
                ".landing-glow-card-root:hover &": {
                  borderColor: alpha(theme.appDesign.accentSoft, 0.32),
                  boxShadow: `0 0 0 1px ${alpha(theme.appDesign.accentSoft, 0.12)} inset,
                    0 22px 48px ${alpha(theme.appDesign.background, 0.42)}`,
                },
              }
            : {}),
          ...cardSx,
        }}
      >
        {children}
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
          ".landing-glow-card-root:hover &": {
            opacity: 1,
          },
        }}
      />
    </Box>
  );
};
