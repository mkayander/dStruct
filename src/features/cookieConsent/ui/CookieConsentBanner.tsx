"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  IconButton,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { MOBILE_PHASE_NAV_HEIGHT } from "#/features/playground/ui/MobilePhaseNavBar";
import { useI18nContext } from "#/shared/hooks";
import { useMobileLayout } from "#/shared/hooks/useMobileLayout";
import { glassOverlaySx } from "#/shared/ui/styles/glassOverlayStyles";

type CookieConsentBannerProps = {
  isSettingsView: boolean;
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
  onClose: () => void;
  /** Visual surface used by optional dismiss effects (e.g. Thanos disintegrate). */
  surfaceRef?: React.Ref<HTMLDivElement>;
};

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  isSettingsView,
  onAcceptAll,
  onRejectNonEssential,
  onClose,
  surfaceRef,
}) => {
  const { LL } = useI18nContext();
  const theme = useTheme();
  const router = useRouter();
  const isMobileLayout = useMobileLayout();
  const isPlaygroundRoute = router.pathname.startsWith("/playground");
  const reserveMobileNavSpace = isMobileLayout && isPlaygroundRoute;

  return (
    <Box
      component="section"
      role="region"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      sx={{
        position: "fixed",
        bottom: reserveMobileNavSpace
          ? `calc(${MOBILE_PHASE_NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`
          : 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        px: { xs: 2, sm: 3 },
        pb: reserveMobileNavSpace
          ? 2
          : "calc(16px + env(safe-area-inset-bottom, 0px))",
        pt: 2,
        pointerEvents: "none",
      }}
    >
      <Paper
        ref={surfaceRef}
        elevation={0}
        sx={{
          pointerEvents: "auto",
          maxWidth: 960,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: 2,
          borderRadius: 2,
          position: "relative",
          ...glassOverlaySx(theme),
        }}
      >
        {isSettingsView ? (
          <IconButton
            aria-label={LL.COOKIE_SETTINGS_CLOSE()}
            onClick={onClose}
            size="small"
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        ) : null}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            pr: isSettingsView ? 4 : 0,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              id="cookie-consent-title"
              variant="subtitle2"
              component="h2"
              sx={{ mb: 0.5 }}
            >
              {isSettingsView
                ? LL.COOKIE_SETTINGS_TITLE()
                : LL.COOKIE_CONSENT_TITLE()}
            </Typography>
            <Typography
              id="cookie-consent-description"
              variant="body2"
              color="text.secondary"
            >
              {isSettingsView
                ? LL.COOKIE_SETTINGS_MESSAGE()
                : LL.COOKIE_CONSENT_MESSAGE()}{" "}
              <MuiLink
                component={Link}
                href="/privacy"
                underline="hover"
                color="inherit"
                sx={{ fontWeight: 600 }}
              >
                {LL.PRIVACY_POLICY()}
              </MuiLink>
              .
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ flexShrink: 0 }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={onRejectNonEssential}
            >
              {LL.COOKIE_REJECT_NON_ESSENTIAL()}
            </Button>
            <Button variant="outlined" color="primary" onClick={onAcceptAll}>
              {LL.COOKIE_ACCEPT_ALL()}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};
