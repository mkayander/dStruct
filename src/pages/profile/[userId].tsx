import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { LeetCodeStats } from "#/features/profile/ui/LeetCodeStats";
import { UserSettings } from "#/features/profile/ui/UserSettings";
import { useGetUserProfileQuery } from "#/graphql/generated";
import { useI18nContext } from "#/shared/hooks";
import {
  absoluteUrlFromPathname,
  DEFAULT_SITE_DESCRIPTION,
  pathnameFromResolvedUrl,
} from "#/shared/lib/seo";
import { SiteSeoHead } from "#/shared/ui/seo/SiteSeoHead";
import { MainLayout } from "#/shared/ui/templates/MainLayout";

type ProfilePageProps = {
  canonicalUrl: string;
};

const ProfilePage: NextPage<ProfilePageProps> = ({ canonicalUrl }) => {
  const { LL } = useI18nContext();
  const router = useRouter();
  const session = useSession();
  const leetCodeUsername = session.data?.user.leetCodeUsername;
  const username = session.data?.user.name;

  const routeUserId =
    typeof router.query.userId === "string" ? router.query.userId : undefined;
  const sessionUserId = session.data?.user?.id;
  const isOwnProfile = Boolean(
    routeUserId && sessionUserId && routeUserId === sessionUserId,
  );

  const userProfileQueryResult = useGetUserProfileQuery({
    variables: {
      username: leetCodeUsername || "",
    },
    skip: !leetCodeUsername,
  });

  const renderAuthStatusSection = () => {
    if (session.status === "loading") {
      return (
        <Box sx={{ mb: 8, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      );
    }

    if (session.status === "authenticated" && sessionUserId) {
      if (isOwnProfile) {
        return null;
      }
      return (
        <Box sx={{ mb: 8, textAlign: "center" }}>
          <Link href={`/profile/${sessionUserId}`}>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
              }}
            >
              {LL.HOME_OPEN_PROFILE()}
            </Button>
          </Link>
        </Box>
      );
    }

    if (session.status === "authenticated") {
      return (
        <Box sx={{ mb: 8, textAlign: "center" }}>
          <Alert severity="warning" sx={{ maxWidth: 480, mx: "auto" }}>
            {LL.HOME_PROFILE_LINK_UNAVAILABLE()}
          </Alert>
        </Box>
      );
    }

    return (
      <Box sx={{ mb: 8, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            mb: 2,
          }}
        >
          {LL.HOME_AUTH_HEADLINE_SIGNED_OUT()}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 640,
            mx: "auto",
            mb: 1.5,
            lineHeight: 1.65,
          }}
        >
          {LL.HOME_AUTH_BODY_SIGNED_OUT()}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            maxWidth: 560,
            mx: "auto",
            mb: 4,
            opacity: 0.9,
          }}
        >
          {LL.HOME_AUTH_VISUALIZATION_NOTE()}
        </Typography>
      </Box>
    );
  };

  return (
    <MainLayout>
      <SiteSeoHead
        title="Profile | dStruct"
        description={DEFAULT_SITE_DESCRIPTION}
        canonicalUrl={canonicalUrl}
        noindex
      />
      <Container>
        {renderAuthStatusSection()}
        {session.status !== "loading" ? (
          <>
            <Typography variant="h5" my={3}>
              {LL.USER_DASHBOARD({
                name: leetCodeUsername || username || "User",
              })}
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <UserSettings />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <LeetCodeStats userProfile={userProfileQueryResult} />
              </Grid>
            </Grid>
          </>
        ) : null}
      </Container>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps<ProfilePageProps> = async (
  ctx,
) => {
  const raw = ctx.params?.userId;
  const profileUserId = typeof raw === "string" ? raw : "";
  if (!profileUserId) {
    return { notFound: true };
  }
  const pathOnly =
    pathnameFromResolvedUrl(ctx.resolvedUrl) ||
    `/profile/${profileUserId}`;
  const canonicalUrl = absoluteUrlFromPathname(pathOnly);
  return { props: { canonicalUrl } };
};

export default ProfilePage;
