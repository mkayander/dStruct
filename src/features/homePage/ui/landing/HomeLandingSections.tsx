import {
  alpha,
  Box,
  Button,
  Card,
  CardActionArea,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import React from "react";

import { LANDING_PLAYGROUND_DEMOS } from "#/features/homePage/lib/landingPlaygroundDemos";
import type { TranslationFunctions } from "#/i18n/i18n-types";

export type HomeLandingSectionsProps = {
  LL: TranslationFunctions;
};

type LandingDemoId = (typeof LANDING_PLAYGROUND_DEMOS)[number]["id"];

function landingDemoLabel(LL: TranslationFunctions, id: LandingDemoId): string {
  switch (id) {
    case "tree":
      return LL.HOME_DEMO_TREE();
    case "graph":
      return LL.HOME_DEMO_GRAPH();
    case "grid":
      return LL.HOME_DEMO_GRID();
    case "trie":
      return LL.HOME_DEMO_TRIE();
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export const HomeLandingSections: React.FC<HomeLandingSectionsProps> = ({
  LL,
}) => {
  const theme = useTheme();

  const sectionTitleSx = {
    fontWeight: 800,
    letterSpacing: "-0.02em",
    mb: 1,
    color: "text.primary",
  };

  const bandSx = {
    py: { xs: 6, md: 9 },
  };

  const pillars = [
    {
      title: LL.HOME_PILLAR_VIS_TITLE(),
      body: LL.HOME_PILLAR_VIS_BODY(),
    },
    {
      title: LL.HOME_PILLAR_WORKERS_TITLE(),
      body: LL.HOME_PILLAR_WORKERS_BODY(),
    },
    {
      title: LL.HOME_PILLAR_REPLAY_TITLE(),
      body: LL.HOME_PILLAR_REPLAY_BODY(),
    },
    {
      title: LL.HOME_PILLAR_BENCH_TITLE(),
      body: LL.HOME_PILLAR_BENCH_BODY(),
    },
  ] as const;

  const steps = [
    {
      n: 1,
      title: LL.HOME_HOW_STEP_1_TITLE(),
      body: LL.HOME_HOW_STEP_1_BODY(),
    },
    {
      n: 2,
      title: LL.HOME_HOW_STEP_2_TITLE(),
      body: LL.HOME_HOW_STEP_2_BODY(),
    },
    {
      n: 3,
      title: LL.HOME_HOW_STEP_3_TITLE(),
      body: LL.HOME_HOW_STEP_3_BODY(),
    },
  ] as const;

  return (
    <Box component="section" aria-labelledby="landing-how-heading">
      <Box
        sx={{
          ...bandSx,
          bgcolor: alpha(theme.palette.primary.main, 0.06),
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            id="landing-how-heading"
            variant="h4"
            component="h2"
            sx={sectionTitleSx}
          >
            {LL.HOME_SECTION_HOW_IT_WORKS()}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 640 }}
          >
            {LL.HOME_LANDING_SUBTITLE()}
          </Typography>
          <Grid container spacing={3}>
            {steps.map((step) => (
              <Grid key={step.n} size={{ xs: 12, md: 4 }}>
                <Stack spacing={1.5} sx={{ height: "100%" }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                    }}
                  >
                    {step.n}
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.65 }}
                  >
                    {step.body}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ ...bandSx, bgcolor: "background.default" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ ...sectionTitleSx, mb: 3 }}
          >
            {LL.HOME_SECTION_WHY_DSTUCT()}
          </Typography>
          <Grid container spacing={2.5}>
            {pillars.map((p) => (
              <Grid key={p.title} size={{ xs: 12, sm: 6 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: "background.paper",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.08)}`,
                    },
                  }}
                >
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      {p.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.65 }}
                    >
                      {p.body}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          ...bandSx,
          bgcolor: alpha(theme.palette.secondary.main, 0.06),
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ ...sectionTitleSx, mb: 3 }}
          >
            {LL.HOME_SECTION_LANGUAGES()}
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {LL.HOME_LANG_JS_TITLE()}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.65 }}
                >
                  {LL.HOME_LANG_JS_BODY()}
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {LL.HOME_LANG_PYTHON_TITLE()}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.65 }}
                >
                  {LL.HOME_LANG_PYTHON_BODY()}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ ...bandSx, bgcolor: "background.default" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ ...sectionTitleSx, mb: 1 }}
          >
            {LL.HOME_SECTION_TRY_DEMOS()}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 560 }}
          >
            {LL.HOME_TRY_DEMOS_LEAD()}
          </Typography>
          <Grid container spacing={2}>
            {LANDING_PLAYGROUND_DEMOS.map(({ href, id, Icon }) => (
              <Grid key={href} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: "hidden",
                    transition: "transform 0.2s ease, border-color 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                    },
                  }}
                >
                  <CardActionArea component={Link} href={href} sx={{ p: 2.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          color: "primary.main",
                        }}
                      >
                        <Icon fontSize="small" />
                      </Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {landingDemoLabel(LL, id)}
                      </Typography>
                    </Stack>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 3, textAlign: { xs: "center", sm: "left" } }}>
            <Button
              component={Link}
              href="/playground?view=browse"
              variant="contained"
              size="large"
              sx={{ borderRadius: 2, px: 3 }}
            >
              {LL.BROWSE_PROJECTS()}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
