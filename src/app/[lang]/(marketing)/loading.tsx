import { Box, Container, Skeleton } from "@mui/material";

/** Instant-nav fallback for marketing home while client islands hydrate. */
export default function LangMarketingHomeLoading() {
  return (
    <Box component="main" sx={{ minHeight: "100vh" }}>
      <Box
        sx={{
          minHeight: { xs: 520, md: 640 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Skeleton
            variant="text"
            width="70%"
            height={56}
            animation="wave"
            sx={{ mx: "auto", mb: 2 }}
          />
          <Skeleton
            variant="text"
            width="50%"
            height={32}
            animation="wave"
            sx={{ mx: "auto", mb: 4 }}
          />
          <Skeleton
            variant="rounded"
            height={280}
            animation="wave"
            sx={{ borderRadius: 3 }}
          />
        </Container>
      </Box>
    </Box>
  );
}
