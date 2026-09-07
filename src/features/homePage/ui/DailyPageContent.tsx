import { Box, Container, Link as MuiLink, Typography } from "@mui/material";
import type { ReactNode } from "react";
import React from "react";

import type { TranslationFunctions } from "#/i18n/i18n-types";

type DailyPageContentProps = {
  LL: TranslationFunctions;
  children: ReactNode;
};

/** Server-rendered daily page shell (marketing chrome supplies client app bar). */
export const DailyPageContent: React.FC<DailyPageContentProps> = ({
  LL,
  children,
}) => (
  <Box
    sx={{
      bgcolor: "background.default",
      py: { xs: 8, md: 12 },
    }}
  >
    <Container
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1536px !important",
        "@media (min-width: 600px) and (max-width: 1199.95px)": {
          maxWidth: "1200px !important",
        },
      }}
    >
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            mb: 2,
          }}
        >
          {LL.HOME_DAILY_SECTION_TITLE()}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 4,
            maxWidth: 560,
            mx: "auto",
            lineHeight: 1.65,
          }}
        >
          {LL.HOME_DAILY_SECTION_LEAD()}{" "}
          <MuiLink
            href="https://leetcode.com/"
            target="_blank"
            rel="noreferrer"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              fontWeight: 600,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            LeetCode
          </MuiLink>
        </Typography>
      </Box>

      {children}
    </Container>
  </Box>
);
