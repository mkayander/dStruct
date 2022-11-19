import { NextPage } from 'next';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { trpc } from '#/utils';
import { MainLayout } from '#/layouts';

const ApiExamplePage: NextPage = () => {
    const avatar = trpc.avatar.useQuery();

    return (
        <MainLayout>
            <Container>
                <Box
                    sx={{
                        my: 4,
                    }}
                >
                    <Typography variant="h2">API Example</Typography>
                    <p>The examples below show responses from the example API endpoints.</p>
                    <p>
                        <em>You must be signed in to see responses.</em>
                    </p>
                    <h2>Session</h2>
                    <p>/api/examples/session</p>
                    <iframe src="/api/examples/session" />
                    <h2>JSON Web Token</h2>
                    <p>/api/examples/jwt</p>
                    <iframe src="/api/examples/jwt" />

                    <h2>Hello World</h2>
                    <p>/api/examples/hello</p>
                    <iframe src="/api/examples/hello" />

                    <h2>Protected Avatar</h2>
                    <p>TRPC</p>
                    {avatar.isError && JSON.stringify(avatar.error, null, 2)}
                    {!avatar.isLoading ? avatar.data : <CircularProgress variant="indeterminate" />}
                </Box>
            </Container>
        </MainLayout>
    );
};

export default ApiExamplePage;
