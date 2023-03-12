import {
  CircularProgress,
  Container,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";

import { useDailyQuestionData } from "#/api";
import { QuestionSummary } from "#/components";
import { useGetUserProfileQuery } from "#/graphql/generated";
import {
  DailyProblem,
  LeetCodeStats,
  MainLayout,
  UserSettings,
} from "#/layouts";

const DashboardPage: React.FC = () => {
  const session = useSession();
  const leetCodeUsername = session.data?.user.leetCodeUsername;

  const userProfileQueryResult = useGetUserProfileQuery({
    variables: {
      username: leetCodeUsername || "",
    },
    skip: !leetCodeUsername,
  });

  const questionDataQuery = useDailyQuestionData();

  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <MainLayout setIsLightMode={() => {}}>
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
                  Please sign in to start using the benefits! 🚀
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
