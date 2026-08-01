import { Box, Container, Link as MuiLink, Typography } from "@mui/material";
import type { InferGetStaticPropsType, NextPage } from "next";
import Link from "next/link";
import React from "react";

import { PrivacyCookieInventoryTable } from "#/features/privacy/ui/PrivacyCookieInventoryTable";
import { getI18nPropsWithCanonical } from "#/i18n/getI18nProps";
import { useI18nContext } from "#/shared/hooks";
import { SiteSeoHead } from "#/shared/ui/seo/SiteSeoHead";
import { MainLayout } from "#/shared/ui/templates/MainLayout";

export const getStaticProps = getI18nPropsWithCanonical("/privacy");

type PrivacyPageProps = InferGetStaticPropsType<typeof getStaticProps>;

const PrivacySection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <Box component="section" sx={{ mt: 4 }}>
    <Typography variant="h5" component="h2" gutterBottom>
      {title}
    </Typography>
    {children}
  </Box>
);

const PrivacyParagraph: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
    {children}
  </Typography>
);

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
        <PrivacyParagraph>{LL.PRIVACY_INTRO()}</PrivacyParagraph>
        <PrivacyParagraph>{LL.PRIVACY_LAST_UPDATED()}</PrivacyParagraph>

        <PrivacySection title={LL.PRIVACY_CONTROLLER_TITLE()}>
          <PrivacyParagraph>{LL.PRIVACY_CONTROLLER_BODY()}</PrivacyParagraph>
          <PrivacyParagraph>
            {LL.PRIVACY_CONTACT_INTRO()}{" "}
            <MuiLink href={`mailto:${LL.PRIVACY_CONTACT_EMAIL()}`}>
              {LL.PRIVACY_CONTACT_EMAIL()}
            </MuiLink>
            .
          </PrivacyParagraph>
        </PrivacySection>

        <PrivacySection title={LL.PRIVACY_DATA_COLLECTED_TITLE()}>
          <PrivacyParagraph>
            {LL.PRIVACY_DATA_COLLECTED_BODY()}
          </PrivacyParagraph>
        </PrivacySection>

        <PrivacySection title={LL.PRIVACY_LEGAL_BASES_TITLE()}>
          <PrivacyParagraph>{LL.PRIVACY_LEGAL_BASES_BODY()}</PrivacyParagraph>
        </PrivacySection>

        <PrivacySection title={LL.PRIVACY_RETENTION_TITLE()}>
          <PrivacyParagraph>{LL.PRIVACY_RETENTION_BODY()}</PrivacyParagraph>
        </PrivacySection>

        <PrivacySection title={LL.PRIVACY_RIGHTS_TITLE()}>
          <PrivacyParagraph>{LL.PRIVACY_RIGHTS_BODY()}</PrivacyParagraph>
          <PrivacyParagraph>
            {LL.PRIVACY_WITHDRAW_CONSENT_BODY()}
          </PrivacyParagraph>
        </PrivacySection>

        <PrivacySection title={LL.PRIVACY_SUBPROCESSORS_TITLE()}>
          <PrivacyParagraph>{LL.PRIVACY_SUBPROCESSORS_BODY()}</PrivacyParagraph>
        </PrivacySection>

        <PrivacySection title={LL.PRIVACY_TRANSFERS_TITLE()}>
          <PrivacyParagraph>{LL.PRIVACY_TRANSFERS_BODY()}</PrivacyParagraph>
        </PrivacySection>

        <PrivacySection title={LL.PRIVACY_COOKIES_SECTION_TITLE()}>
          <PrivacyParagraph>
            {LL.PRIVACY_COOKIES_OVERVIEW_BODY()}
          </PrivacyParagraph>

          <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>
            {LL.PRIVACY_COOKIES_ESSENTIAL_TITLE()}
          </Typography>
          <PrivacyParagraph>
            {LL.PRIVACY_COOKIES_ESSENTIAL_BODY()}
          </PrivacyParagraph>

          <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>
            {LL.PRIVACY_COOKIES_PREFERENCES_TITLE()}
          </Typography>
          <PrivacyParagraph>
            {LL.PRIVACY_COOKIES_PREFERENCES_BODY()}
          </PrivacyParagraph>

          <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>
            {LL.PRIVACY_COOKIES_ANALYTICS_TITLE()}
          </Typography>
          <PrivacyParagraph>
            {LL.PRIVACY_COOKIES_ANALYTICS_BODY()}
          </PrivacyParagraph>

          <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1 }}>
            {LL.PRIVACY_COOKIE_TABLE_TITLE()}
          </Typography>
          <PrivacyParagraph>{LL.PRIVACY_COOKIE_TABLE_INTRO()}</PrivacyParagraph>
          <PrivacyCookieInventoryTable LL={LL} />
        </PrivacySection>

        <PrivacySection title={LL.PRIVACY_EXECUTION_TITLE()}>
          <PrivacyParagraph>{LL.PRIVACY_EXECUTION_BODY()}</PrivacyParagraph>
        </PrivacySection>

        <PrivacySection title={LL.PRIVACY_CCPA_TITLE()}>
          <PrivacyParagraph>{LL.PRIVACY_CCPA_BODY()}</PrivacyParagraph>
        </PrivacySection>

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
