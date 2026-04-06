import AutoAwesomeMotion from "@mui/icons-material/AutoAwesomeMotion";
import CallSplit from "@mui/icons-material/CallSplit";
import History from "@mui/icons-material/History";
import PlayCircleOutline from "@mui/icons-material/PlayCircleOutline";
import {
  alpha,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
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

function landingDemoSlug(LL: TranslationFunctions, id: LandingDemoId): string {
  switch (id) {
    case "tree":
      return LL.HOME_DEMO_SLUG_INVERT_BINARY_TREE();
    case "graph":
      return LL.HOME_DEMO_SLUG_PATH_IN_GRAPH();
    case "grid":
      return LL.HOME_DEMO_SLUG_SHORTEST_PATH_MATRIX();
    case "trie":
      return LL.HOME_DEMO_SLUG_TRIE_NAME();
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

  const capabilities = [
    {
      icon: <CallSplit fontSize="small" />,
      title: LL.HOME_PILLAR_VIS_TITLE(),
      body: LL.HOME_PILLAR_VIS_BODY(),
    },
    {
      icon: <PlayCircleOutline fontSize="small" />,
      title: LL.HOME_PILLAR_WORKERS_TITLE(),
      body: LL.HOME_PILLAR_WORKERS_BODY(),
    },
    {
      icon: <History fontSize="small" />,
      title: LL.HOME_PILLAR_REPLAY_TITLE(),
      body: LL.HOME_PILLAR_REPLAY_BODY(),
    },
    {
      icon: <AutoAwesomeMotion fontSize="small" />,
      title: LL.HOME_PILLAR_BENCH_TITLE(),
      body: LL.HOME_PILLAR_BENCH_BODY(),
    },
  ] as const;

  const coreLoop = [
    {
      label: LL.RUN(),
      body: LL.HOME_HOW_STEP_2_BODY(),
    },
    {
      label: LL.FORWARD(),
      body: LL.HOME_HOW_STEP_3_BODY(),
    },
    {
      label: LL.REPLAY(),
      body: LL.HOME_PILLAR_REPLAY_BODY(),
    },
    {
      label: LL.CALLSTACK(),
      body: LL.HOME_PILLAR_VIS_BODY(),
    },
  ] as const;

  return (
    <Box component="section" aria-labelledby="landing-capabilities-heading">
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            id="landing-capabilities-heading"
            variant="h3"
            component="h2"
            sx={{ mb: 1.5, maxWidth: 780 }}
          >
            {LL.HOME_PILLAR_VIS_TITLE()}
          </Typography>
          <Grid container spacing={3}>
            {capabilities.map((capability) => (
              <Grid key={capability.title} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  sx={{
                    height: "100%",
                    borderColor: alpha(theme.appDesign.outline, 0.12),
                    bgcolor: alpha(theme.appDesign.surface, 0.92),
                  }}
                >
                  <Stack spacing={1.5} sx={{ p: 2.5 }}>
                    <Chip
                      size="small"
                      icon={capability.icon}
                      label={capability.title}
                      sx={{ alignSelf: "flex-start" }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.75 }}
                    >
                      {capability.body}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: alpha(theme.appDesign.surfaceLow, 0.65),
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ mb: 1.5, maxWidth: 720 }}
          >
            {LL.HOME_SECTION_HOW_IT_WORKS()}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 680 }}
          >
            {LL.HOME_HOW_STEP_1_BODY()}
          </Typography>
          <Grid container spacing={2}>
            {coreLoop.map((item, index) => (
              <Grid key={item.label} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  sx={{
                    height: "100%",
                    bgcolor: alpha(theme.appDesign.surfaceLowest, 0.86),
                    borderColor: alpha(theme.appDesign.outline, 0.1),
                  }}
                >
                  <Stack spacing={2} sx={{ p: 2.5 }}>
                    <Typography variant="overline" color="text.secondary">
                      {String(index + 1).padStart(2, "0")}
                    </Typography>
                    <Typography variant="h6">{item.label}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.75 }}
                    >
                      {item.body}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: alpha(theme.appDesign.surfaceLow, 0.65),
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="subtitle2"
            component="h2"
            sx={{ color: "text.secondary", mb: 1.5 }}
          >
            {LL.HOME_SECTION_TRY_DEMOS()}
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            sx={{ mb: 1.5, maxWidth: 720 }}
          >
            {LL.BROWSE_PROJECTS()}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 620 }}
          >
            {LL.HOME_TRY_DEMOS_LEAD()}
          </Typography>
          <Grid container spacing={2.5}>
            {LANDING_PLAYGROUND_DEMOS.map(({ href, id, Icon }) => (
              <Grid key={href} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card
                  sx={{
                    height: "100%",
                    borderColor: alpha(theme.appDesign.outline, 0.12),
                    bgcolor: alpha(theme.appDesign.surface, 0.92),
                    transition: "transform 0.2s ease, border-color 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      borderColor: alpha(theme.appDesign.accentSoft, 0.28),
                    },
                  }}
                >
                  <CardActionArea component={Link} href={href} sx={{ p: 2.5 }}>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: alpha(theme.appDesign.accent, 0.12),
                          color: theme.appDesign.accentSoft,
                        }}
                      >
                        <Icon />
                      </Box>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {LL.HOME_SECTION_TRY_DEMOS()}
                        </Typography>
                        <Typography variant="h6">
                          {landingDemoLabel(LL, id)}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {landingDemoSlug(LL, id)}
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
              sx={{ px: 3 }}
            >
              {LL.BROWSE_PROJECTS()}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
