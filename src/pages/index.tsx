import React, { ChangeEventHandler, useState } from 'react';
import type { NextPage } from 'next';
import { trpc } from '@src/utils/trpc';
import { Box, Button, CircularProgress, Container, Link, TextField, Typography } from '@mui/material';
import { useGetUserProfileLazyQuery } from '@src/graphql/generated';
import { ProblemCard, SessionWidget } from '@src/components';
import { MainLayout } from '@src/layouts';

const Home: NextPage = () => {
    const { data: problemsList, refetch } = trpc.useQuery(['problem.all']);

    const [username, setUsername] = useState<string>('');

    const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (e) => setUsername(e.target.value);

    const [fetchUserProfile, { data: userProfile, loading, error }] = useGetUserProfileLazyQuery();

    const handleLaunchQuery = async () => {
        const result = await fetchUserProfile({ variables: { username } });
        console.log(result);
    };

    return (
        <MainLayout>
            <Container>
                <Box
                    sx={{
                        my: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        MUI v5 + Next.js with TypeScript example
                    </Typography>
                    <Link href="/" color="secondary">
                        Go to the about page
                    </Link>
                    <Link href="/api-example">Go to the api test page</Link>
                    {problemsList?.map((item) => (
                        <ProblemCard key={item.id} data={item} />
                    ))}
                    <Button type="button" variant="contained" onClick={() => refetch()}>
                        Refetch
                    </Button>
                    <br />

                    <SessionWidget />

                    {/*<ProTip />*/}
                    {/*<Copyright />*/}

                    <br />

                    <TextField
                        variant="outlined"
                        label="Username"
                        onChange={handleUsernameChange}
                        error={Boolean(error)}
                    />
                    <Button onClick={handleLaunchQuery}>Launch query</Button>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <div>
                            <pre>{JSON.stringify(error || userProfile, null, 4)}</pre>
                        </div>
                    )}
                </Box>
            </Container>
        </MainLayout>
    );
};

export default Home;
