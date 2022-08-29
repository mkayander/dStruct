import React, { ChangeEventHandler, useState } from 'react';
import type { NextPage } from 'next';
import { trpc } from '@src/utils/trpc';
import { ProblemCard, SessionWidget } from '@src/components';
import { Box, Button, CircularProgress, Container, Link, TextField, Typography } from '@mui/material';
import { useUserProfile } from '@src/graphql/queries';

const Home: NextPage = () => {
    const { data: problemsList, refetch } = trpc.useQuery(['problem.all']);

    const [username, setUsername] = useState<string>('');

    const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (e) => setUsername(e.target.value);

    const { isFetching, data: userProfile, isError, refetch: refetchUserProfile } = useUserProfile(username);

    const handleLaunchQuery = async () => {
        const result = await refetchUserProfile();
        console.log(result.data);
    };

    return (
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

                <TextField variant="outlined" label="Username" onChange={handleUsernameChange} error={isError} />
                <Button onClick={handleLaunchQuery}>Launch query</Button>
                {isFetching ? (
                    <CircularProgress />
                ) : (
                    <Typography>
                        <pre>{JSON.stringify(userProfile, null, 4)}</pre>
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default Home;
