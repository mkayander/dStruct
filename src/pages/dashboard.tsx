import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { trpc } from '@src/utils';
import { MainLayout } from '@src/layouts';

export default function DashboardPage() {
    return (
        <MainLayout>
            <Container>
                <Box
                    sx={{
                        my: 4,
                    }}
                >
                    Dashboard
                </Box>
            </Container>
        </MainLayout>
    );
}
