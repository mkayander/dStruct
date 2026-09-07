import { Box, Container, Skeleton } from "@mui/material";

/** Instant-nav fallback for `/daily` while the client view hydrates. */
export default function DailyLoading() {
  return (
    <Box component="main" sx={{ minHeight: "85vh", py: 8 }}>
      <Container maxWidth="lg">
        <Skeleton
          variant="text"
          width="60%"
          height={48}
          animation="wave"
          sx={{ mx: "auto", mb: 4 }}
        />
        <Skeleton
          variant="rounded"
          height={320}
          animation="wave"
          sx={{ borderRadius: 2 }}
        />
      </Container>
    </Box>
  );
}
