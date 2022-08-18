import type { NextPage } from 'next';
import { trpc } from '@src/utils/trpc';
import { Problem } from '@src/components';
import { Box, Button, Container, Link, Typography } from '@mui/material';

const Home: NextPage = () => {
    const { data: problemsList, refetch } = trpc.useQuery(['problem.all']);

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
                    <Problem key={item.id} data={item} />
                ))}
                <Button type="button" variant="contained" onClick={() => refetch()}>
                    Refetch
                </Button>
                {/*<ProTip />*/}
                {/*<Copyright />*/}
            </Box>
        </Container>
    );
};

export default Home;
