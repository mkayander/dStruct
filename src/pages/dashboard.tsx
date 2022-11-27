import React from 'react';
import { useSession } from 'next-auth/react';
import { Container, Grid } from '@mui/material';
import { DailyProblem, LeetCodeStats, UserSettings } from '#/layouts';
import { useGetUserProfileQuery } from '#/graphql/generated';
import { useDailyQuestionData } from '#/api';
import { QuestionSummary } from '#/components';

const DashboardPage: React.FC = () => {
  const session = useSession();
  const leetCodeUsername = session.data?.user.leetCodeUsername;

  const userProfileQueryResult = useGetUserProfileQuery({
    variables: {
      username: leetCodeUsername || '',
    },
    skip: !leetCodeUsername,
  });

  const questionDataQuery = useDailyQuestionData();

  return (
    <Container>
      <h1>
        {leetCodeUsername ? `${leetCodeUsername}'s Dashboard` : 'Dashboard'}
      </h1>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <UserSettings />
        </Grid>
        <Grid item xs={12} md={6}>
          <LeetCodeStats userProfile={userProfileQueryResult} />
        </Grid>
        <Grid item xs={12}>
          <QuestionSummary questionDataQuery={questionDataQuery} my={24} />
        </Grid>
        <Grid item>
          <DailyProblem questionDataQuery={questionDataQuery} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
