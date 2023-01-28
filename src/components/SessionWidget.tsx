import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

export const SessionWidget: React.FC = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (loading) {
    return (
      <Box>
        <CircularProgress variant="indeterminate" />
      </Box>
    );
  }

  const handleSignIn: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();
    await signIn();
    console.log("Sign in function finished");
  };

  const handleSignOut: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();
    await signOut();
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "90px",
        flexFlow: "column nowrap",
        alignItems: "center",
        marginTop: "24px",
        justifyContent: "space-between",
      }}
    >
      {!session?.user ? (
        <>
          <Typography variant="h5" gutterBottom>
            You are not signed in
          </Typography>
          <Button
            type="button"
            color="primary"
            variant="outlined"
            href="/api/auth/signin"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            You are signed in as:
          </Typography>
          {session.user.image && (
            <img
              alt="user avatar"
              referrerPolicy="no-referrer"
              src={session.user.image}
            />
          )}
          <Typography variant="body1">
            {session.user.name} <br />
            {session.user.email} <br />
            {session.user.image} <br />
          </Typography>
          <Button
            type="button"
            color="error"
            variant="outlined"
            href="/api/auth/signOut"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </>
      )}
    </Box>
  );
};
