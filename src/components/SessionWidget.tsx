import React from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';

interface SessionWidgetProps {}

export const SessionWidget: React.FC<SessionWidgetProps> = () => {
    const { data: session, status } = useSession();
    const loading = status === 'loading';

    if (loading) {
        return (
            <Box>
                <CircularProgress variant="indeterminate" />
            </Box>
        );
    }

    const handleSignIn: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();
        await signIn();
        console.log('Sign in function finished');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '90px',
                flexFlow: 'column nowrap',
                alignItems: 'center',
                marginTop: '24px',
                justifyContent: 'space-between',
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
                    {session.user.image && <img alt="user avatar" src={session.user.image} />}
                    <Typography variant="body1">
                        {session.user.name} <br />
                        {session.user.email} <br />
                        {session.user.image} <br />
                    </Typography>
                </>
            )}
        </Box>
    );
};
