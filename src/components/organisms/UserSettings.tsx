import { ManageAccounts } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { deleteCookie, setCookie } from "cookies-next";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import React from "react";

import { DataSection } from "#/components/templates/DataSection";
import {
  useGetUserProfileLazyQuery,
  useGlobalDataLazyQuery,
} from "#/graphql/generated";
import { useI18nContext } from "#/hooks";
import { trpc } from "#/utils";

export const UserSettings: React.FC = () => {
  const { LL } = useI18nContext();
  const session = useSession();
  const { enqueueSnackbar } = useSnackbar();

  const [getUserProfile, { loading: gqlLoading }] =
    useGetUserProfileLazyQuery();

  const userId = session.data?.user.id;

  const {
    data: user,
    isLoading,
    refetch,
  } = trpc.user.getById.useQuery(userId, {
    enabled: Boolean(userId),
  });

  const trpcUtils = trpc.useUtils();

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

  const formik = useFormik({
    initialValues: {
      username: "",
      token: "",
    },
    validate: async (values) => {
      const errors: { username?: string; token?: string } = {};
      if (!values.username) {
        errors.username = "Required";
      }
      return errors;
    },
    onSubmit: async ({ username, token }, { setErrors }) => {
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

      enqueueSnackbar("User linked successfully! 🔗", {
        variant: "success",
      });

      await trpcUtils.user.getById.invalidate(userId);
      await refetch();
    },
  });

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
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
              <TextField
                name="username"
                label={LL.USERNAME()}
                variant="outlined"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.username}
                error={Boolean(formik.errors.username)}
                helperText={formik.errors.username}
              />
              <TextField
                name="token"
                label={LL.TOKEN()}
                variant="outlined"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.token}
                error={Boolean(formik.errors.token)}
                helperText={formik.errors.token}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting || loading}
                startIcon={
                  formik.isSubmitting || loading ? (
                    <CircularProgress size="1rem" />
                  ) : null
                }
              >
                {LL.SUBMIT()}
              </Button>
            </Stack>
          </form>
        )}
      </Stack>
    </DataSection>
  );
};
