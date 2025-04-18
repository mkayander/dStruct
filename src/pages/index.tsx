import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
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

  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function,react/jsx-no-undef
    <MainLayout onScroll={handleScroll}>
      <Head>
        <title>dStruct</title>
      </Head>
      <Box
        onMouseMove={handleMouseMove}
        onMouseLeave={resetAngles}
        sx={{
          position: "relative",
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          boxShadow: `0 0 32px 0 ${alpha(theme.palette.primary.main, 0.5)}`,
          pb: isMobile ? 4 : 10,
          marginTop: -8.7,
          borderRadius: isMobile ? "0 0 50% 2%" : "0 0 80% 2%",
          color: theme.palette.primary.contrastText,
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 3,
            width: "100%",
            height: "100%",
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, #00000000 100%)`,
            opacity: 0.3,
            pointerEvents: "none",
          },
        }}
      >
        <Box position="absolute" height={isMobile ? 700 : 600} width="100%">
          <LogoModelView controlsRef={controlsRef} />
        </Box>
        <Stack
          position="relative"
          spacing={2}
          alignItems={isMobile ? "flex-start" : "center"}
          pt={32}
          px={3}
          sx={{
            pointerEvents: "none",
            "& > *": {
              pointerEvents: "initial",
              zIndex: 5,
            },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              userSelect: "none",
            }}
          >
            {LL.DATA_STRUCTURES_SIMPLIFIED()}
          </Typography>
          <Typography variant="subtitle1">
            {LL.VISUALIZE_YOUR_LEETCODE_PROBLEMS_JUST_FORM_YOUR_CODE()} 👩‍💻
          </Typography>
          <br />
          <Link data-testid="cta-to-playground" href={"/playground"}>
            <Button variant="outlined" color="inherit" size="large">
              {LL.TRY_IT_OUT_NOW()} 🚀
            </Button>
          </Link>
        </Stack>
      </Box>
      <Container>
        <Grid container spacing={2} mt={4}>
          {session.status === "loading" ? (
            <CircularProgress />
          ) : session.status === "authenticated" ? (
            <Grid item xs={12} display="flex" justifyContent="center">
              <Link href={`/profile/${session.data.user.id}`}>
                <Button variant="contained">Open Profile</Button>
              </Link>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Tooltip
                title={LL.SIGN_IN_WITH_GITHUB_OR_GOOGLE_IN_THE_TOP_RIGHT()}
              >
                <Typography
                  variant="h4"
                  sx={{
                    width: "fit-content",
                    margin: "auto",
                  }}
                >
                  {LL.SIGN_IN_TO_KEEP_TRACK_OF_YOUR_PROGRESS_AND_MORE()} 🔑
                </Typography>
              </Tooltip>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              mt={6}
              display="inline-block"
              position="relative"
              zIndex={100}
              sx={{
                fontWeight: "bold",
                textShadow: "0 0 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              Don&apos;t know what to solve today? Here is a daily problem from{" "}
              <MuiLink
                href={"https://leetcode.com/"}
                color="inherit"
                target="_blank"
                rel="noreferrer"
              >
                LeetCode
              </MuiLink>
              !
            </Typography>
            <QuestionSummary
              questionDataQuery={questionDataQuery}
              mt={4}
              mb={12}
            />
          </Grid>
          <Grid item xs={12}>
            <DailyProblem questionDataQuery={questionDataQuery} />
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export { getI18nProps as getStaticProps } from "#/i18n/getI18nProps";

export default DashboardPage;
