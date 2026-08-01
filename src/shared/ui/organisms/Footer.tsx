import { Box, Container, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

import { useOptionalCookieConsentContext } from "#/features/cookieConsent/context/CookieConsentContext";
import { useI18nContext } from "#/shared/hooks";

export const Footer: React.FC = () => {
  const { LL } = useI18nContext();
  const cookieConsent = useOptionalCookieConsentContext();

  return (
    <Container component="footer">
      <Box
        sx={{
          mt: 4,
          mb: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="caption">© Max Kayander, 2026.</Typography>
        <MuiLink
          component={Link}
          href="/privacy"
          variant="caption"
          underline="hover"
          color="text.secondary"
        >
          {LL.PRIVACY_POLICY()}
        </MuiLink>
        {cookieConsent ? (
          <MuiLink
            component="button"
            type="button"
            variant="caption"
            underline="hover"
            color="text.secondary"
            onClick={cookieConsent.openCookieSettings}
            sx={{
              background: "none",
              border: 0,
              cursor: "pointer",
              font: "inherit",
              p: 0,
            }}
          >
            {LL.COOKIE_SETTINGS_LINK()}
          </MuiLink>
        ) : null}
      </Box>
    </Container>
  );
};
