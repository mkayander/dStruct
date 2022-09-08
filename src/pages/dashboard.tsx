import { Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { trpc } from '@src/utils';
import { MainLayout } from '@src/layouts';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useGetUserProfileLazyQuery } from '@src/graphql/generated';

export default function DashboardPage() {
    const session = useSession();
    const [userNameInput, setUserNameInput] = useState<string>();

    const [getUserProfile, { loading, error }] = useGetUserProfileLazyQuery();

    const userId = session.data?.user.id;

    const {
        data: user,
        isLoading,
        refetch,
    } = trpc.useQuery(['user.getById', { id: userId }], {
        enabled: Boolean(userId),
    });

    const linkUser = trpc.useMutation(['leetcode.linkUser']);

    if (!session.data) {
        return <CircularProgress />;
    }

    const handleSubmit = async () => {
        if (!userNameInput) return;

        const { data } = await getUserProfile({ variables: { username: userNameInput } });
        if (!data?.matchedUser) return;

        const { userAvatar } = data.matchedUser.profile;

        await linkUser.mutate({
            username: userNameInput,
            userAvatar: userAvatar || 'none',
        });

        await refetch();
    };

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
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                '& > *': {
                                    marginTop: '12px',
                                },
                            }}
                        >
                            {/*<Typography>Please enter your LeetCode account name:</Typography>*/}
                            <TextField
                                label="Username"
                                onChange={(event) => setUserNameInput(event.currentTarget.value)}
                                error={Boolean(error)}
                            />
                            <Button
                                type="button"
                                variant="outlined"
                                color="primary"
                                onClick={handleSubmit}
                                sx={{ display: 'block' }}
                            >
                                Submit!
                            </Button>
                            {loading && <CircularProgress variant="indeterminate" />}
                        </Box>
                    )}
                </Box>
            </Container>
        </MainLayout>
    );
}
