import {
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
import { DailyProblem } from "#/features/homePage/ui/DailyProblem/DailyProblem";
import { QuestionSummary } from "#/features/homePage/ui/QuestionSummary";
import type { Locales, Translations } from "#/i18n/i18n-types";
import { useI18nContext } from "#/shared/hooks";
import { useMobileLayout } from "#/shared/hooks/useMobileLayout";
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
    const azimuthalAngle =
      ((window.innerWidth - event.clientX) / window.innerWidth) * Math.PI -
      Math.PI / 2;

    const rect = event.currentTarget.getBoundingClientRect();
    const polarAngle =
      ((rect.height - event.clientY) / rect.height) * (Math.PI * 1) +
      Math.PI / 22;

    if (controlsRef.current) {
      controlsRef.current.setAzimuthalAngle(azimuthalAngle);
      controlsRef.current.setPolarAngle(polarAngle);
    }
  };

  const handleScroll: PageScrollContainerProps["onScroll"] = (event) => {
    if (!isMobile) return;

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

  const isMobile = useMobileLayout();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  return (
    <MainLayout onScroll={handleScroll} headerPosition="fixed">
      <Head>
        <title>dStruct</title>
      </Head>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: theme.palette.primary.contrastText,
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          clipPath: isMobile
            ? "ellipse(100% 100% at 50% 0%)"
            : isMediumScreen
              ? "ellipse(120% 100% at 50% 0%)"
              : "ellipse(140% 100% at 50% 0%)",
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
                  variant={isMobile ? "h3" : isMediumScreen ? "h2" : "h1"}
                  sx={{
                    fontWeight: "bold",
                    lineHeight: 1.2,
                    maxWidth: { xs: "90%", md: "100%" },
                  }}
                >
                  {LL.DATA_STRUCTURES_SIMPLIFIED()}
                </Typography>
                <Typography
                  variant={isMobile ? "body1" : isMediumScreen ? "body1" : "h6"}
                  sx={{
                    opacity: 0.9,
                    maxWidth: { xs: "85%", md: "100%" },
                    lineHeight: 1.6,
                  }}
                >
                  {LL.VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE()}{" "}
                  Developers deserve better tools for understanding complex
                  algorithms and data structures.
                </Typography>
                <Stack
                  direction={isMobile ? "column" : "row"}
                  spacing={2}
                  sx={{ pt: 2 }}
                >
                  <Link data-testid="cta-to-playground" href={"/playground"}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth={isMobile}
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
                      }}
                    >
                      {LL.TRY_IT_OUT_NOW()} 🚀
                    </Button>
                  </Link>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth={isMobile}
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      color: "inherit",
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                      px: { xs: 3, md: 4 },
                      py: 1.5,
                    }}
                  >
                    Documentation →
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            {/* Right Column - 3D Model */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                onMouseMove={handleMouseMove}
                onMouseLeave={resetAngles}
                sx={{
                  height: { xs: 400, md: isMediumScreen ? 500 : 600 },
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
            ) : session.status === "authenticated" ? (
              <Link href={`/profile/${session.data.user.id}`}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Open Profile
                </Button>
              </Link>
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
                  The right balance of security and simplicity.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    maxWidth: 600,
                    mx: "auto",
                    mb: 4,
                  }}
                >
                  {LL.SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE()}{" "}
                  Authentication happens on your server, the visualization
                  happens on ours.
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
              Don&apos;t know what to solve today?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 4,
              }}
            >
              Here is a daily problem from{" "}
              <MuiLink
                href="https://leetcode.com/"
                target="_blank"
                rel="noreferrer"
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                LeetCode
              </MuiLink>
              !
            </Typography>
          </Box>

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
    </MainLayout>
  );
};

export { getI18nProps as getStaticProps } from "#/i18n/getI18nProps";

export default DashboardPage;
