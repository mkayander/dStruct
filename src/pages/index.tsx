import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { type OrbitControls as ThreeOrbitControls } from "three-stdlib";

import { useDailyQuestionData } from "#/api";
import { LANDING_PRIMARY_PLAYGROUND_HREF } from "#/features/homePage/lib/landingPlaygroundDemos";
import { DailyProblem } from "#/features/homePage/ui/DailyProblem/DailyProblem";
import { HomeLandingFaq } from "#/features/homePage/ui/landing/HomeLandingFaq";
import { HomeLandingSections } from "#/features/homePage/ui/landing/HomeLandingSections";
import { QuestionSummary } from "#/features/homePage/ui/QuestionSummary";
import type { Locales, Translations } from "#/i18n/i18n-types";
import { useI18nContext } from "#/shared/hooks";
import { LogoModelView } from "#/shared/ui/molecules/LogoModelView";
import { MainLayout } from "#/shared/ui/templates/MainLayout";
import type { PageScrollContainerProps } from "#/shared/ui/templates/PageScrollContainer";

const DashboardPage: NextPage<{
  i18n: {
    locale: Locales;
    dictionary: Translations;
  };
}> = () => {
  const { LL } = useI18nContext();
  const session = useSession();
  const theme = useTheme();
  const controlsRef = React.useRef<ThreeOrbitControls>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();

    // Calculate normalized mouse position (0 to 1) within the hero section
    const normalizedX = (event.clientX - rect.left) / rect.width;
    const normalizedY = (event.clientY - rect.top) / rect.height;

    // Map to OrbitControls angle ranges
    // Azimuthal: left to right (minAzimuthAngle to maxAzimuthAngle)
    const minAzimuthalAngle = Math.PI / -2.2;
    const maxAzimuthalAngle = Math.PI / 2.2;
    const azimuthalAngle =
      minAzimuthalAngle +
      (1 - normalizedX) * (maxAzimuthalAngle - minAzimuthalAngle);

    // Polar: top to bottom (minPolarAngle to maxPolarAngle)
    const minPolarAngle = Math.PI / 10;
    const maxPolarAngle = Math.PI / 1.1;
    const polarAngle =
      minPolarAngle + (1 - normalizedY) * (maxPolarAngle - minPolarAngle);

    if (controlsRef.current) {
      controlsRef.current.setAzimuthalAngle(azimuthalAngle);
      controlsRef.current.setPolarAngle(polarAngle);
    }
  };

  const handleScroll: PageScrollContainerProps["onScroll"] = (event) => {
    if (!window.matchMedia("(max-width: 599.95px)").matches) return;

    if (event.target instanceof Element) {
      const { scrollTop } = event.target;
      const polarAngle =
        Math.PI / 2.5 -
        ((scrollTop / window.innerHeight) * Math.PI - Math.PI / 4);
      if (controlsRef.current) {
        controlsRef.current.setAzimuthalAngle(Math.PI / 4);
        controlsRef.current.setPolarAngle(polarAngle);
      }
    }
  };

  const resetAngles = () => {
    if (controlsRef.current) {
      controlsRef.current.setAzimuthalAngle(0);
      controlsRef.current.setPolarAngle(Math.PI / 2);
    }
  };

  const questionDataQuery = useDailyQuestionData();

  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  return (
    <MainLayout onScroll={handleScroll} headerPosition="fixed">
      <Head>
        <title>dStruct</title>
        <link rel="canonical" href="https://dstruct.pro/" />
      </Head>
      {/* Hero Section */}
      <Box
        onMouseMove={handleMouseMove}
        onMouseLeave={resetAngles}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: theme.palette.primary.contrastText,
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          clipPath: "ellipse(140% 100% at 50% 0%)",
          [theme.breakpoints.between("sm", "lg")]: {
            clipPath: "ellipse(120% 100% at 50% 0%)",
          },
          [theme.breakpoints.down("sm")]: {
            clipPath: "ellipse(100% 100% at 50% 0%)",
          },
        }}
      >
        <Container
          maxWidth={isMediumScreen ? "lg" : "xl"}
          sx={{ px: { xs: 2, sm: 3, md: 4 } }}
        >
          <Grid container alignItems="center" spacing={{ xs: 3, md: 4 }}>
            {/* Left Column - Content */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2} sx={{ pt: { xs: 6, md: 8 } }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: "bold",
                    lineHeight: 1.15,
                    maxWidth: { xs: "95%", md: "100%" },
                    fontSize: { xs: "2rem", sm: "2.75rem", lg: "3.5rem" },
                    letterSpacing: "-0.02em",
                  }}
                >
                  {LL.HOME_LANDING_TITLE()}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.92,
                    maxWidth: { md: "95%" },
                    lineHeight: 1.65,
                    fontSize: { sm: "1.05rem", lg: "1.2rem" },
                  }}
                >
                  {LL.HOME_LANDING_SUBTITLE()}
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ pt: 2 }}
                >
                  <Link
                    data-testid="cta-to-playground"
                    href={LANDING_PRIMARY_PLAYGROUND_HREF}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        color: "inherit",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.3)",
                        },
                        px: { xs: 3, md: 4 },
                        py: 1.5,
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      {LL.TRY_IT_OUT_NOW()} 🚀
                    </Button>
                  </Link>
                  <Link href="/playground?view=browse">
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        color: "inherit",
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        backdropFilter: "blur(10px)",
                        "&:hover": {
                          borderColor: "rgba(255, 255, 255, 0.5)",
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                        },
                        px: { xs: 3, md: 4 },
                        py: 1.5,
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      {LL.BROWSE_PROJECTS()}
                    </Button>
                  </Link>
                </Stack>
                <Box sx={{ pt: 1 }}>
                  <Button
                    component={Link}
                    href="#faq"
                    variant="text"
                    sx={{
                      color: "inherit",
                      opacity: 0.85,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { opacity: 1, bgcolor: "rgba(255,255,255,0.08)" },
                    }}
                  >
                    {LL.HOME_HERO_FAQ_LINK()} →
                  </Button>
                </Box>
              </Stack>
            </Grid>

            {/* Right Column - 3D Model */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: { xs: 400, md: isMediumScreen ? 500 : 700 },
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LogoModelView controlsRef={controlsRef} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <HomeLandingSections LL={LL} />

      {/* Content Section */}
      <Box
        sx={{
          bgcolor: "background.default",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container
          maxWidth={isMediumScreen ? "lg" : "xl"}
          sx={{ px: { xs: 2, sm: 3, md: 4 } }}
        >
          {/* Authentication Status Section */}
          <Box sx={{ mb: 8, textAlign: "center" }}>
            {session.status === "loading" ? (
              <CircularProgress />
            ) : session.status === "authenticated" &&
              session.data?.user?.id ? (
              <Link href={`/profile/${session.data.user.id}`}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                  }}
                >
                  {LL.HOME_OPEN_PROFILE()}
                </Button>
              </Link>
            ) : session.status === "authenticated" ? (
              <Alert severity="warning" sx={{ maxWidth: 480, mx: "auto" }}>
                {LL.HOME_PROFILE_LINK_UNAVAILABLE()}
              </Alert>
            ) : (
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "text.primary",
                    mb: 2,
                  }}
                >
                  {LL.HOME_AUTH_HEADLINE_SIGNED_OUT()}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    maxWidth: 640,
                    mx: "auto",
                    mb: 1.5,
                    lineHeight: 1.65,
                  }}
                >
                  {LL.HOME_AUTH_BODY_SIGNED_OUT()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    maxWidth: 560,
                    mx: "auto",
                    mb: 4,
                    opacity: 0.9,
                  }}
                >
                  {LL.HOME_AUTH_VISUALIZATION_NOTE()}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Daily Problem Section */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h4"
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

          {questionDataQuery.error ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              {LL.HOME_DAILY_QUESTION_ERROR()}
            </Alert>
          ) : null}

          <Grid container spacing={4} justifyContent="center">
            <Grid size={{ xs: 12, lg: 8 }}>
              <QuestionSummary
                questionDataQuery={questionDataQuery}
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <DailyProblem questionDataQuery={questionDataQuery} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <HomeLandingFaq LL={LL} />
    </MainLayout>
  );
};

export { getI18nProps as getStaticProps } from "#/i18n/getI18nProps";

export default DashboardPage;
