import { Box, Container, Link as MuiLink, Typography } from "@mui/material";
import type { InferGetStaticPropsType, NextPage } from "next";
import Link from "next/link";

import { getI18nPropsWithCanonical } from "#/i18n/getI18nProps";
import { useI18nContext } from "#/shared/hooks";
import { SiteSeoHead } from "#/shared/ui/seo/SiteSeoHead";
import { MainLayout } from "#/shared/ui/templates/MainLayout";

export const getStaticProps = getI18nPropsWithCanonical("/privacy");

type PrivacyPageProps = InferGetStaticPropsType<typeof getStaticProps>;

const PrivacyPage: NextPage<PrivacyPageProps> = ({ canonicalUrl }) => {
  const { LL } = useI18nContext();

  return (
    <MainLayout>
      <SiteSeoHead
        title={`${LL.PRIVACY_PAGE_TITLE()} — dStruct`}
        description={LL.PRIVACY_INTRO()}
        canonicalUrl={canonicalUrl}
      />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {LL.PRIVACY_PAGE_TITLE()}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {LL.PRIVACY_INTRO()}
        </Typography>

        <Box component="section" sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {LL.PRIVACY_COOKIES_SECTION_TITLE()}
          </Typography>

          <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>
            {LL.PRIVACY_COOKIES_ESSENTIAL_TITLE()}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {LL.PRIVACY_COOKIES_ESSENTIAL_BODY()}
          </Typography>

          <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>
            {LL.PRIVACY_COOKIES_PREFERENCES_TITLE()}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {LL.PRIVACY_COOKIES_PREFERENCES_BODY()}
          </Typography>

          <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>
            {LL.PRIVACY_COOKIES_ANALYTICS_TITLE()}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {LL.PRIVACY_COOKIES_ANALYTICS_BODY()}
          </Typography>
        </Box>

        <Box component="section" sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {LL.PRIVACY_EXECUTION_TITLE()}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {LL.PRIVACY_EXECUTION_BODY()}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          <MuiLink component={Link} href="/" underline="hover">
            {LL.DASHBOARD()}
          </MuiLink>
        </Typography>
      </Container>
    </MainLayout>
  );
};

export default PrivacyPage;
