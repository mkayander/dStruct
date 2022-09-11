import React, { useState } from 'react';
import { trpc } from '@src/utils';
import { MainLayout } from '@src/layouts';
import { useSession } from 'next-auth/react';
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import { useGetUserProfileLazyQuery } from '@src/graphql/generated';
import { Formik, Form, Field } from 'formik';
import { Autocomplete, TextField, Select, Switch, ToggleButtonGroup } from 'formik-mui';

export default function DashboardPage() {
    const session = useSession();

    const [getUserProfile, { loading: gqlLoading, error }] = useGetUserProfileLazyQuery();

    const userId = session.data?.user.id;

    const {
        data: user,
        isLoading,
        refetch,
    } = trpc.useQuery(['user.getById', { id: userId }], {
        enabled: Boolean(userId),
    });

    const linkUser = trpc.useMutation(['leetcode.linkUser']);
    const unlinkUser = trpc.useMutation(['leetcode.unlinkUser']);

    const loading = gqlLoading || linkUser.isLoading || unlinkUser.isLoading;

    const handleLinkedUserReset = async () => {
        await unlinkUser.mutate();
        await refetch();
    };

    if (!session.data) {
        return <CircularProgress />;
    }

    return (
        <MainLayout isLoading={isLoading}>
            <Container>
                <h1>Dashboard</h1>
                <Box
                    sx={{
                        my: 4,
                    }}
                >
                    <Typography variant="h5">LeetCode Data</Typography>
                    {user?.leetCodeUsername ? (
                        <Box>
                            <Typography>Your LeetCode account name:</Typography>
                            <Typography>{user.leetCodeUsername}</Typography>
                            <Button
                                disabled={unlinkUser.isLoading}
                                color="error"
                                variant="outlined"
                                onClick={handleLinkedUserReset}
                            >
                                Reset
                            </Button>
                        </Box>
                    ) : (
                        <Formik
                            initialValues={{
                                username: '',
                            }}
                            validate={async (values) => {
                                const errors: { username?: string } = {};
                                if (!values.username) {
                                    errors.username = 'Required';
                                } else {
                                }
                                return errors;
                            }}
                            onSubmit={async ({ username }, { setErrors }) => {
                                const { data } = await getUserProfile({ variables: { username: username } });
                                if (!data?.matchedUser) {
                                    setErrors({ username: 'No user with given username found!' });
                                    return;
                                }

                                const { userAvatar } = data.matchedUser.profile;

                                await linkUser.mutate({
                                    username,
                                    userAvatar: userAvatar || 'none',
                                });

                                await refetch();
                            }}
                        >
                            {({ submitForm, isSubmitting, touched, errors }) => (
                                <Box>
                                    <Typography>Please enter your LeetCode account name:</Typography>
                                    <Field
                                        component={TextField}
                                        name="username"
                                        type="text"
                                        label="Username"
                                        required
                                        helperText="LeetCode Username"
                                        // error={errors['username']}
                                    />

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                        sx={{ display: 'block' }}
                                    >
                                        Submit!
                                    </Button>
                                    {loading && <CircularProgress variant="indeterminate" />}
                                </Box>
                            )}
                        </Formik>
                    )}
                </Box>
            </Container>
        </MainLayout>
    );
}
