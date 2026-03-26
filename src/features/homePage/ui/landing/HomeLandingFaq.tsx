import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from "@mui/material";
import React from "react";

import type { TranslationFunctions } from "#/i18n/i18n-types";

export type HomeLandingFaqProps = {
  LL: TranslationFunctions;
};

export const HomeLandingFaq: React.FC<HomeLandingFaqProps> = ({ LL }) => {
  const items = [
    { q: LL.HOME_FAQ_Q_01(), a: LL.HOME_FAQ_A_01() },
    { q: LL.HOME_FAQ_Q_02(), a: LL.HOME_FAQ_A_02() },
    { q: LL.HOME_FAQ_Q_03(), a: LL.HOME_FAQ_A_03() },
    { q: LL.HOME_FAQ_Q_04(), a: LL.HOME_FAQ_A_04() },
    { q: LL.HOME_FAQ_Q_05(), a: LL.HOME_FAQ_A_05() },
    { q: LL.HOME_FAQ_Q_06(), a: LL.HOME_FAQ_A_06() },
    { q: LL.HOME_FAQ_Q_07(), a: LL.HOME_FAQ_A_07() },
    { q: LL.HOME_FAQ_Q_08(), a: LL.HOME_FAQ_A_08() },
    { q: LL.HOME_FAQ_Q_09(), a: LL.HOME_FAQ_A_09() },
    { q: LL.HOME_FAQ_Q_10(), a: LL.HOME_FAQ_A_10() },
    { q: LL.HOME_FAQ_Q_11(), a: LL.HOME_FAQ_A_11() },
    { q: LL.HOME_FAQ_Q_12(), a: LL.HOME_FAQ_A_12() },
    { q: LL.HOME_FAQ_Q_13(), a: LL.HOME_FAQ_A_13() },
    { q: LL.HOME_FAQ_Q_14(), a: LL.HOME_FAQ_A_14() },
  ];

  return (
    <Box
      id="faq"
      component="section"
      aria-labelledby="landing-faq-heading"
      sx={{
        py: { xs: 6, md: 9 },
        bgcolor: "background.paper",
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          id="landing-faq-heading"
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.02em",
            mb: 3,
            color: "text.primary",
          }}
        >
          {LL.HOME_SECTION_FAQ()}
        </Typography>
        {items.map((item, index) => (
          <Accordion
            key={`home-landing-faq-${String(index + 1).padStart(2, "0")}`}
            disableGutters
            elevation={0}
            defaultExpanded={index === 0}
            sx={{
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: "12px !important",
              mb: 1.5,
              "&:before": { display: "none" },
              overflow: "hidden",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                fontWeight: 600,
                "& .MuiAccordionSummary-content": { my: 1.5 },
              }}
            >
              {item.q}
            </AccordionSummary>
            <AccordionDetails
              sx={{
                pt: 0,
                pb: 2,
                color: "text.secondary",
                lineHeight: 1.65,
              }}
            >
              {item.a}
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
};
