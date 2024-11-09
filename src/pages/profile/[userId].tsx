import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import React from "react";

import { LeetCodeStats } from "#/components/organisms/LeetCodeStats";
import { UserSettings } from "#/components/organisms/UserSettings";
import { useGetUserProfileQuery } from "#/graphql/generated";
import { useI18nContext } from "#/hooks";
import { MainLayout } from "#/shared/ui/templates/MainLayout";

const ProfilePage: NextPage = () => {
  const { LL } = useI18nContext();
  const session = useSession();
  const leetCodeUsername = session.data?.user.leetCodeUsername;
  const username = session.data?.user.name;

  const userProfileQueryResult = useGetUserProfileQuery({
    variables: {
      username: leetCodeUsername || "",
    },
    skip: !leetCodeUsername,
  });

  return (
    <MainLayout>
      <Container>
        <Typography variant="h5" my={3}>
          {LL.USER_DASHBOARD({ name: leetCodeUsername || username || "User" })}
        </Typography>
        <Grid container spacing={2}>
          {session.status === "loading" ? (
            <CircularProgress />
          ) : (
            <>
              <Grid item xs={12} md={6}>
                <UserSettings />
              </Grid>
              <Grid item xs={12} md={6}>
                <LeetCodeStats userProfile={userProfileQueryResult} />
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default ProfilePage;
