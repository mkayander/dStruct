import { Box, Container, Skeleton } from "@mui/material";

/** Instant-nav fallback for privacy policy while client chrome hydrates. */
export default function LangPrivacyLoading() {
  return (
    <Box component="main" sx={{ minHeight: "70vh", py: 8 }}>
      <Container maxWidth="md">
        <Skeleton variant="text" width="40%" height={48} animation="wave" />
        <Skeleton variant="text" width="100%" animation="wave" sx={{ mt: 3 }} />
        <Skeleton variant="text" width="95%" animation="wave" />
        <Skeleton variant="text" width="90%" animation="wave" />
      </Container>
    </Box>
  );
}
