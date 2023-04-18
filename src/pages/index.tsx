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
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

import { useDailyQuestionData } from "#/api";
import { QuestionSummary } from "#/components";
import { useGetUserProfileQuery } from "#/graphql/generated";
import { useMobileLayout } from "#/hooks/useMobileLayout";
import {
  DailyProblem,
  LeetCodeStats,
  MainLayout,
  UserSettings,
} from "#/layouts";

const DashboardPage: React.FC = () => {
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <MainLayout>
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          boxShadow: `0 0 32px 0 ${alpha(theme.palette.primary.main, 0.5)}`,
          pb: isMobile ? 4 : 10,
          marginTop: -8.7,
          borderRadius: isMobile ? "0 0 50% 2%" : "0 0 80% 2%",
          color: theme.palette.primary.contrastText,
        }}
      >
        <Stack
          spacing={2}
          alignItems={isMobile ? "flex-start" : "center"}
          pt={12}
          px={3}
        >
          <Typography variant="h2">Data Structures Simplified</Typography>
          <Typography variant="subtitle1">
            Visualize your LeetCode problems just form your code 👩‍💻
          </Typography>
          <br />
          <Link href={"/playground"}>
            <Button variant="outlined" color="inherit" size="large">
              Try it out now 🚀
            </Button>
          </Link>
        </Stack>
      </Box>
      <Container>
        <Typography variant="h5" my={3}>
          {leetCodeUsername ? `${leetCodeUsername}'s Dashboard` : "Dashboard"}
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
              <Tooltip title="Sign in with GitHub or Google at the top right corner">
                <Typography
                  variant="h4"
                  sx={{
                    width: "fit-content",
                    margin: "auto",
                  }}
                >
                  Sign in to keep track of your progress and more! 🔑
                </Typography>
              </Tooltip>
            </Grid>
          )}
          <Grid item xs={12}>
            <QuestionSummary questionDataQuery={questionDataQuery} my={24} />
          </Grid>
          <Grid item>
            <DailyProblem questionDataQuery={questionDataQuery} />
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default DashboardPage;
