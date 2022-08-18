import { Box, Container, Typography } from '@mui/material';

export default function ApiExamplePage() {
    return (
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
            </Box>
        </Container>
    );
}
