import { ManageAccounts } from "@mui/icons-material";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { deleteCookie, setCookie } from "cookies-next";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import { useSession } from "next-auth/react";
import React from "react";

import { DataSection } from "#/components";
import {
  useGetUserProfileLazyQuery,
  useGlobalDataLazyQuery,
} from "#/graphql/generated";
import { useI18nContext } from "#/hooks";
import { trpc } from "#/utils";

export const UserSettings: React.FC = () => {
  const { LL } = useI18nContext();
  const session = useSession();

  const [getUserProfile, { loading: gqlLoading }] =
    useGetUserProfileLazyQuery();

  // const { data } = useGlobalDataQuery();

  const userId = session.data?.user.id;

  const {
    data: user,
    isLoading,
    refetch,
  } = trpc.user.getById.useQuery(userId, {
    enabled: Boolean(userId),
    trpc: {},
  });

  const trpcUtils = trpc.useContext();

  const linkUser = trpc.leetcode.linkUser.useMutation();
  const unlinkUser = trpc.leetcode.unlinkUser.useMutation();

  const loading =
    userId &&
    (gqlLoading || linkUser.isLoading || unlinkUser.isLoading || isLoading);

  const handleLinkedUserReset = async () => {
    await unlinkUser.mutate();
    await trpcUtils.user.getById.invalidate(userId);
    await refetch();
  };

  const [getGlobalData] = useGlobalDataLazyQuery();

  return (
    <DataSection title={LL.USER_SETTINGS()} Icon={ManageAccounts}>
      <Stack spacing={2}>
        {user?.leetCodeUsername ? (
          <>
            <Typography>{LL.YOUR_LEETCODE_ACCOUNT_NAME()}</Typography>
            <Typography>{user.leetCodeUsername}</Typography>
            <Button
              disabled={unlinkUser.isLoading}
              color="error"
              variant="outlined"
              onClick={handleLinkedUserReset}
            >
              {LL.RESET()}
            </Button>
          </>
        ) : (
          <Formik
            initialValues={{
              username: "",
              token: "",
            }}
            validate={async (values) => {
              const errors: { username?: string } = {};
              if (!values.username) {
                errors.username = "Required";
              } else {
              }
              return errors;
            }}
            onSubmit={async ({ username, token }, { setErrors }) => {
              setCookie("LEETCODE_SESSION", token);

              const { data: globalData } = await getGlobalData();

              const extUsername = globalData?.userStatus.username;

              if (!extUsername) {
                setErrors({ token: "Invalid token!" });
                deleteCookie("LEETCODE_SESSION");
                return;
              }

              if (extUsername !== username) {
                setErrors({
                  username: "Username does not match the token!",
                });
                deleteCookie("LEETCODE_SESSION");
                return;
              }

              const { data } = await getUserProfile({
                variables: { username: username },
              });

              if (!data?.matchedUser) {
                setErrors({ username: "No user with given username found!" });
                return;
              }

              const { userAvatar } = data.matchedUser.profile;

              await linkUser.mutate({
                username,
                userAvatar: userAvatar || "none",
                token,
              });

              await trpcUtils.user.getById.invalidate(userId);
              await refetch();
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Stack spacing={1}>
                <Typography>
                  {LL.PLEASE_ENTER_YOUR_LEETCODE_ACCOUNT_NAME()}
                </Typography>
                <Field
                  component={TextField}
                  name="username"
                  type="text"
                  label={LL.USERNAME()}
                  required
                  helperText="LeetCode Username"
                  // error={errors['username']}
                />

                <Field
                  component={TextField}
                  name="token"
                  type="text"
                  label={LL.TOKEN()}
                  required
                  helperText="LeetCode Token"
                  // error={errors['username']}
                />

                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                  sx={{ display: "block" }}
                >
                  {LL.SUBMIT()}
                </Button>
                {loading && <CircularProgress variant="indeterminate" />}
              </Stack>
            )}
          </Formik>
        )}
      </Stack>
    </DataSection>
  );
};
