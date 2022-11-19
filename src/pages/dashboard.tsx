import React from 'react';
import { DailyProblem, LeetCodeStats, MainLayout, UserSettings } from '#/layouts';
import { Container, Grid } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useGetUserProfileQuery } from '#/graphql/generated';
import { useDailyQuestionData } from '#/api';
import { QuestionSummary } from '#/components';

export default function DashboardPage() {
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
        <MainLayout>
            <Container>
                <h1>{leetCodeUsername ? `${leetCodeUsername}'s Dashboard` : 'Dashboard'}</h1>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <UserSettings />
                    </Grid>
                    <Grid item xs={6}>
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
        </MainLayout>
    );
}
