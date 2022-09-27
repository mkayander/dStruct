import React from 'react';
import { DailyProblem, LeetCodeStats, MainLayout, UserSettings } from '@src/layouts';
import { Container } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useGetUserProfileQuery } from '@src/graphql/generated';
import { useDailyQuestionData } from '@src/api';
import { QuestionSummary } from '@src/components';

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
                <UserSettings />
                <LeetCodeStats userProfile={userProfileQueryResult} />
                <QuestionSummary questionDataQuery={questionDataQuery} my={24} />
                <DailyProblem questionDataQuery={questionDataQuery} />
            </Container>
        </MainLayout>
    );
}
