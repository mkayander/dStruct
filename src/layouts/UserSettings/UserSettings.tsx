import React from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { trpc } from '#/utils';
import { useSession } from 'next-auth/react';
import { useGetUserProfileLazyQuery } from '#/graphql/generated';
import { ManageAccounts } from '@mui/icons-material';
import { DataSection } from '#/components';

export const UserSettings: React.FC = () => {
    const session = useSession();

    const [getUserProfile, { loading: gqlLoading }] = useGetUserProfileLazyQuery();

    // const { data } = useGlobalDataQuery();

    const userId = session.data?.user.id;

    const {
        data: user,
        isLoading,
        refetch,
    } = trpc.user.getById.useQuery(userId, {
        enabled: Boolean(userId),
        trpc: {},
    });

    const trpcUtils = trpc.useContext();

    const linkUser = trpc.leetcode.linkUser.useMutation();
    const unlinkUser = trpc.leetcode.unlinkUser.useMutation();

    const loading = gqlLoading || linkUser.isLoading || unlinkUser.isLoading || isLoading;

    const handleLinkedUserReset = async () => {
        await unlinkUser.mutate();
        await trpcUtils.user.getById.invalidate(userId);
        await refetch();
    };

    return (
        <DataSection title="User Settings" Icon={ManageAccounts}>
            {user?.leetCodeUsername ? (
                <>
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
                </>
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

                        await trpcUtils.user.getById.invalidate(userId);
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
        </DataSection>
    );
};
