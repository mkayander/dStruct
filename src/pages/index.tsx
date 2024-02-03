import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React from "react";

import { useDailyQuestionData } from "#/api";
import { QuestionSummary } from "#/components/molecules/QuestionSummary";
import { DailyProblem } from "#/components/organisms/DailyProblem/DailyProblem";
import { LeetCodeStats } from "#/components/organisms/LeetCodeStats";
import { UserSettings } from "#/components/organisms/UserSettings";
import { MainLayout } from "#/components/templates/MainLayout";
import { useGetUserProfileQuery } from "#/graphql/generated";
import { useI18nContext } from "#/hooks";
import { useMobileLayout } from "#/hooks/useMobileLayout";
import type { Locales, Translations } from "#/i18n/i18n-types";

import { BinaryTreeModel } from "#/3d-models/BinaryTreeModel";

const DashboardPage: NextPage<{
  i18n: {
    locale: Locales;
    dictionary: Translations;
  };
}> = () => {
  const { LL } = useI18nContext();
  const session = useSession();
  const leetCodeUsername = session.data?.user.leetCodeUsername;
  const theme = useTheme();

  const userProfileQueryResult = useGetUserProfileQuery({
    variables: {
      username: leetCodeUsername || "",
    },
    skip: !leetCodeUsername,
  });

  const questionDataQuery = useDailyQuestionData();

  const isMobile = useMobileLayout();

  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function,react/jsx-no-undef
    <MainLayout>
      <Head>
        <title>dStruct</title>
      </Head>
      <Box
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
            opacity: 0.5,
            pointerEvents: "none",
          },
        }}
      >
        <Box position="absolute" height={300} width="100%" top="30px">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight
              intensity={4}
              decay={2}
              color="#bce4ff"
              position={[3.592, 5.939, 3.134]}
              rotation={[-1.839, 0.602, 1.932]}
            />
            <pointLight
              intensity={1}
              decay={2}
              position={[-6.44, -5.881, 2.343]}
              rotation={[-1.839, 0.602, 1.932]}
            />
            <BinaryTreeModel />
            <OrbitControls
              minAzimuthAngle={Math.PI / -2.2}
              maxAzimuthAngle={Math.PI / 2.2}
              minPolarAngle={Math.PI / 10}
              maxPolarAngle={Math.PI / 1.1}
              minDistance={10}
              maxDistance={15}
            />
          </Canvas>
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
        <Typography variant="h5" my={3}>
          {LL.USER_DASHBOARD({ name: leetCodeUsername || "User" })}
        </Typography>
        <Grid container spacing={2}>
          {session.status === "loading" ? (
            <CircularProgress />
          ) : session.status === "authenticated" ? (
            <>
              <Grid item xs={12} md={6}>
                <UserSettings />
              </Grid>
              <Grid item xs={12} md={6}>
                <LeetCodeStats userProfile={userProfileQueryResult} />
              </Grid>
            </>
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
            <QuestionSummary questionDataQuery={questionDataQuery} my={24} />
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
